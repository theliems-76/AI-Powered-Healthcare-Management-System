const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const knowledgeController = require('../controllers/knowledgeController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const uploadDir = path.join(__dirname, '../../uploads/knowledge');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Chỉ chấp nhận PDF và TXT
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
        cb(null, true);
    } else {
        cb(new Error('Chỉ hỗ trợ file định dạng PDF hoặc TXT!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: fileFilter
});

router.post('/upload', verifyToken, checkRole(['ADMIN']), upload.single('file'), knowledgeController.uploadDocument);
router.get('/', verifyToken, checkRole(['ADMIN']), knowledgeController.getDocuments);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), knowledgeController.deleteDocument);

module.exports = router;
