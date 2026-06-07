const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { KnowledgeDocument } = require('../models');

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Không tìm thấy file tải lên.' });
        }

        // Lưu thông tin vào Database
        const doc = await KnowledgeDocument.create({
            filename: req.file.filename,
            original_name: req.file.originalname,
            file_path: req.file.path,
            file_type: req.file.mimetype,
            status: 'PROCESSING',
            uploaded_by: req.user.id
        });

        // Không await để request trả về ngay lập tức, quá trình embed chạy ngầm
        axios.post('http://127.0.0.1:8000/api/v1/ai/knowledge/embed', {
            document_id: doc.id,
            file_path: req.file.path,
            filename: req.file.originalname
        }).then(async (response) => {
            if (response.data.status === 'success') {
                await doc.update({ status: 'COMPLETED' });
            } else {
                await doc.update({ status: 'FAILED' });
            }
        }).catch(async (error) => {
            console.error('Lỗi khi gọi AI embed:', error.message);
            await doc.update({ status: 'FAILED' });
        });

        res.status(201).json({
            status: 'success',
            message: 'Đã nhận file. Đang tiến hành cho AI học kiến thức...',
            document: doc
        });

    } catch (error) {
        console.error('Lỗi Upload Knowledge:', error);
        res.status(500).json({ error: 'Lỗi hệ thống khi tải file lên.' });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const docs = await KnowledgeDocument.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            status: 'success',
            data: docs
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách Knowledge:', error);
        res.status(500).json({ error: 'Lỗi tải danh sách tài liệu.' });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await KnowledgeDocument.findByPk(id);
        
        if (!doc) {
            return res.status(404).json({ error: 'Không tìm thấy tài liệu.' });
        }

        // Xóa file vật lý
        if (fs.existsSync(doc.file_path)) {
            fs.unlinkSync(doc.file_path);
        }

        // Gọi Python AI để xóa vector khỏi bộ nhớ (Tính năng này có thể phát triển sau, tạm thời AI cứ giữ lại kiến thức cũng không sao)
        
        await doc.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Đã xóa tài liệu thành công.'
        });
    } catch (error) {
        console.error('Lỗi xóa Knowledge:', error);
        res.status(500).json({ error: 'Lỗi hệ thống khi xóa tài liệu.' });
    }
};
