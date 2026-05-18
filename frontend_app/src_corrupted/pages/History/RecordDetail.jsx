import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import AssessmentForm from '../Assessment/AssessmentForm';
import AIResults from '../Assessment/AiResults';
import DoctorActionCard from './components/DoctorActionCard';
import PatientDoctorNote from './components/PatientDoctorNote';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function RecordDetail() {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [record, setRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Giữ lại thông tin bệnh nhân được truyền từ trang History
    const patientId = location.state?.patientId || null;
    const patientName = location.state?.patientName || null;

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
            <button
                onClick={() => navigate('/history', { state: patientId ? { patientId, patientName } : undefined })}
                className="mb-6 flex items-center text-slate-500 hover:text-blue-600 font-bold"
            >
                <ArrowLeft size={18} className="mr-1" /> Quay lại lịch sử
            </button>
            
            {}
            <AssessmentForm formData={record.health_indicators} readOnly={true} />
            
            {/* Ghi chú bác sĩ - hiển thị theo role */}
            <div className="mt-6">
                {user?.role === 'DOCTOR'
                    ? <DoctorActionCard recordId={record.id} initialNotes={record.doctor_notes} />
                    : <PatientDoctorNote doctorNotes={record.doctor_notes} />
                }
            </div>

            {}
            <AIResults result={record} />
        </div>
    );
}
