import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

import PatientHeader from './components/PatientHeader';
import PatientSearch from './components/PatientSearch';
import PatientList from './components/PatientList';
import PatientPagination from './components/PatientPagination';

const ITEMS_PER_PAGE = 15;

export default function Patients() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const fetchPatients = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/users/patients?page=${page}&limit=${ITEMS_PER_PAGE}`);
            setPatients(response.data.data);
            setPagination(response.data.pagination);
            setCurrentPage(page);
        } catch (error) {
            toast.error("Không th? t?i danh sách b?nh nhân!");
            console.error("L?i t?i danh sách b?nh nhân", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPatients(1);
    }, [fetchPatients]);

    const handlePageChange = (page) => {
        setSearch('');
        fetchPatients(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredPatients = patients.filter(p =>
        (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.phone || '').toLowerCase().includes(search.toLowerCase())
    );

    const handlePatientClick = (patient) => {
        navigate('/history', { state: { patientId: patient.id, patientName: patient.full_name } });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
            <PatientHeader onAssigned={() => fetchPatients(1)} />
            <PatientSearch
                search={search}
                setSearch={setSearch}
                total={pagination?.total ?? 0}
            />
            <PatientList
                loading={loading}
                patients={filteredPatients}
                onPatientClick={handlePatientClick}
            />
            {}
            {!search && pagination && (
                <PatientPagination
                    pagination={{ ...pagination, page: currentPage }}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
