import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AssessmentForm from '../Assessment/AssessmentForm';
import AIResults from '../Assessment/AiResults';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function RecordDetail() {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const res = await api.get(`/records/${recordId}`);
                setRecord(res.data.data);
            } catch (err) {
                console.error("Lỗi lấy chi tiết:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecord();
    }, [recordId]);

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            <button onClick={() => navigate('/history')} className="mb-6 flex items-center text-xs text-slate-400 uppercase tracking-widest font-bold hover:text-slate-800 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Quay lại lịch sử
            </button>
            
            {}
            <AssessmentForm formData={record.health_indicators} readOnly={true} />
            
            {}
            <AIResults result={record} />
        </div>
    );
}