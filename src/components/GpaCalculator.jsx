import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Download, FileText, Calculator, TrendingUp, User, Calendar, Star, BookOpen } from 'lucide-react';

const GpaCalculator = () => {
    const [semesters, setSemesters] = useState([
        {
            id: 1,
            name: 'Học kỳ 1 năm 1',
            subjects: []
        }
    ]);

    const [currentSemester, setCurrentSemester] = useState(0);
    const [newSubject, setNewSubject] = useState({
        name: '',
        credits: '3',
        grade: ''
    });

    // Lưu dữ liệu vào localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('gpaCalculatorData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setSemesters(parsed.semesters || []);
                setCurrentSemester(parsed.currentSemester || 0);
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }, []);

    // Tự động lưu khi có thay đổi
    useEffect(() => {
        localStorage.setItem('gpaCalculatorData', JSON.stringify({
            semesters,
            currentSemester
        }));
    }, [semesters, currentSemester]);

    // Tính GPA cho một học kỳ
    const calculateSemesterGPA = (subjects) => {
        const validSubjects = subjects.filter(s => s.credits > 0 && s.grade !== '');
        const totalCredits = validSubjects.reduce((sum, subject) => sum + parseFloat(subject.credits), 0);
        const totalGradePoints = validSubjects.reduce((sum, subject) => sum + (parseFloat(subject.grade) * parseFloat(subject.credits)), 0);
        return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    };

    // Tính GPA tích lũy
    const calculateCumulativeGPA = () => {
        let totalCredits = 0;
        let totalGradePoints = 0;

        semesters.forEach(semester => {
            semester.subjects.forEach(subject => {
                if (subject.credits > 0 && subject.grade !== '') {
                    const credits = parseFloat(subject.credits);
                    const grade = parseFloat(subject.grade);
                    totalCredits += credits;
                    totalGradePoints += grade * credits;
                }
            });
        });

        return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    };

    // Thêm môn học mới
    const addSubject = () => {
        if (!newSubject.name.trim() || !newSubject.credits || !newSubject.grade) {
            alert('Vui lòng nhập đầy đủ thông tin môn học!');
            return;
        }

        const credits = parseFloat(newSubject.credits);
        const grade = parseFloat(newSubject.grade);

        if (credits <= 0) {
            alert('Tín chỉ phải lớn hơn 0!');
            return;
        }

        if (grade < 0 || grade > 4) {
            alert('Điểm phải từ 0.0 đến 4.0!');
            return;
        }

        const subject = {
            id: Date.now(),
            name: newSubject.name.trim(),
            credits: credits,
            grade: grade
        };

        const updatedSemesters = [...semesters];
        updatedSemesters[currentSemester].subjects.push(subject);
        setSemesters(updatedSemesters);

        // Reset form
        setNewSubject({
            name: '',
            credits: '3',
            grade: ''
        });
    };

    // Cập nhật môn học
    const updateSubject = (subjectId, field, value) => {
        const updatedSemesters = [...semesters];
        const subject = updatedSemesters[currentSemester].subjects.find(s => s.id === subjectId);
        if (subject) {
            if (field === 'credits') {
                const credits = parseFloat(value);
                if (credits > 0) {
                    subject[field] = credits;
                }
            } else if (field === 'grade') {
                const grade = parseFloat(value);
                if (grade >= 0 && grade <= 4) {
                    subject[field] = grade;
                }
            } else {
                subject[field] = value;
            }
        }
        setSemesters(updatedSemesters);
    };

    // Xóa môn học
    const deleteSubject = (subjectId) => {
        if (confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
            const updatedSemesters = [...semesters];
            updatedSemesters[currentSemester].subjects = updatedSemesters[currentSemester].subjects.filter(s => s.id !== subjectId);
            setSemesters(updatedSemesters);
        }
    };

    // Thêm học kỳ mới
    const addSemester = () => {
        const semesterNumber = semesters.length + 1;
        const newSemester = {
            id: Date.now(),
            name: `Học kỳ ${semesterNumber}`,
            subjects: []
        };
        setSemesters([...semesters, newSemester]);
        setCurrentSemester(semesters.length);
    };

    // Xóa học kỳ
    const deleteSemester = (semesterIndex) => {
        if (semesters.length <= 1) {
            alert('Không thể xóa học kỳ cuối cùng!');
            return;
        }

        if (confirm('Bạn có chắc chắn muốn xóa học kỳ này và tất cả môn học trong đó?')) {
            const updatedSemesters = semesters.filter((_, index) => index !== semesterIndex);
            setSemesters(updatedSemesters);
            if (currentSemester >= updatedSemesters.length) {
                setCurrentSemester(updatedSemesters.length - 1);
            }
        }
    };

    // Cập nhật tên học kỳ
    const updateSemesterName = (semesterIndex, newName) => {
        const updatedSemesters = [...semesters];
        updatedSemesters[semesterIndex].name = newName;
        setSemesters(updatedSemesters);
    };

    // Sao chép học kỳ
    const copySemester = (semesterIndex) => {
        const semesterToCopy = semesters[semesterIndex];
        const newSemester = {
            id: Date.now(),
            name: `${semesterToCopy.name} (Copy)`,
            subjects: semesterToCopy.subjects.map(subject => ({
                ...subject,
                id: Date.now() + Math.random()
            }))
        };
        setSemesters([...semesters, newSemester]);
        setCurrentSemester(semesters.length);
    };

    // Reset tất cả dữ liệu
    const resetAllData = () => {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!')) {
            setSemesters([{
                id: 1,
                name: 'Học kỳ 1 năm 1',
                subjects: []
            }]);
            setCurrentSemester(0);
            localStorage.removeItem('gpaCalculatorData');
        }
    };

    const currentSemesterData = semesters[currentSemester];
    const currentGPA = calculateSemesterGPA(currentSemesterData?.subjects || []);
    const cumulativeGPA = calculateCumulativeGPA();

    // Xác định tình trạng học lực
    const getAcademicStatus = (gpa) => {
        if (gpa >= 3.6) return { status: 'Xuất sắc', color: 'bg-green-50 border-green-200 text-green-700', range: '3.6 - 4.0' };
        if (gpa >= 3.2) return { status: 'Giỏi', color: 'bg-blue-50 border-blue-200 text-blue-700', range: '3.2 - 3.59' };
        if (gpa >= 2.5) return { status: 'Khá', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', range: '2.5 - 3.19' };
        if (gpa >= 2.0) return { status: 'Trung bình', color: 'bg-orange-50 border-orange-200 text-orange-700', range: '2.0 - 2.49' };
        if (gpa >= 1.0) return { status: 'Yếu', color: 'bg-red-50 border-red-200 text-red-700', range: '1.0 - 1.99' };
        return { status: 'Kém', color: 'bg-red-50 border-red-200 text-red-700', range: '0.0 - 0.99' };
    };

    const academicStatus = getAcademicStatus(cumulativeGPA);

    // Tính tổng số môn và tín chỉ
    const totalSubjects = semesters.reduce((sum, semester) => sum + semester.subjects.length, 0);
    const totalCredits = semesters.reduce((sum, semester) =>
        sum + semester.subjects.reduce((semSum, subject) => semSum + parseFloat(subject.credits || 0), 0), 0
    );

    // Export to JSON
    const exportToJSON = () => {
        const data = {
            semesters: semesters,
            currentGPA: currentGPA,
            cumulativeGPA: cumulativeGPA,
            academicStatus: academicStatus.status,
            totalSubjects,
            totalCredits,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gpa-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Export to Excel (CSV format)
    const exportToExcel = () => {
        let csvContent = 'Học kỳ,Tên môn học,Tín chỉ,Điểm GPA\n';

        semesters.forEach(semester => {
            semester.subjects.forEach(subject => {
                csvContent += `"${semester.name}","${subject.name}",${subject.credits},${subject.grade}\n`;
            });
        });

        // Thêm thống kê
        csvContent += '\n\nThống kê:\n';
        csvContent += `Tổng số học kỳ,${semesters.length}\n`;
        csvContent += `Tổng số môn học,${totalSubjects}\n`;
        csvContent += `Tổng số tín chỉ,${totalCredits}\n`;
        csvContent += `GPA hiện tại,${currentGPA.toFixed(3)}\n`;
        csvContent += `GPA tích lũy,${cumulativeGPA.toFixed(3)}\n`;
        csvContent += `Học lực,${academicStatus.status}\n`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bang-diem-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Import từ JSON
    const importFromJSON = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.semesters && Array.isArray(data.semesters)) {
                        setSemesters(data.semesters);
                        setCurrentSemester(0);
                        alert('Import dữ liệu thành công!');
                    } else {
                        alert('File JSON không đúng định dạng!');
                    }
                } catch (error) {
                    alert('Có lỗi khi đọc file JSON!');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Simulate GPA</h1>
                    </div>
                    <p className="text-gray-600 mb-2">Tính toán GPA và mô phỏng kết quả học tập - trước khi bảng điểm thật xuất hiện! 🎓</p>
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Đã lưu tự động
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                    <button
                        onClick={exportToExcel}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Xuất Excel
                    </button>
                    <button
                        onClick={exportToJSON}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Xuất JSON
                    </button>
                    <label className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer">
                        <Download className="w-4 h-4" />
                        Nhập file JSON
                        <input
                            type="file"
                            accept=".json"
                            onChange={importFromJSON}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={resetAllData}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Reset tất cả
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="xl:col-span-3">
                        {/* Semester Management */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Quản lý học kỳ</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={addSemester}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Thêm
                                    </button>
                                    <button
                                        onClick={() => copySemester(currentSemester)}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Sao chép
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {semesters.map((semester, index) => (
                                    <div
                                        key={semester.id}
                                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${index === currentSemester
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setCurrentSemester(index)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={semester.name}
                                                        onChange={(e) => updateSemesterName(index, e.target.value)}
                                                        className="font-medium text-gray-900 bg-transparent border-none outline-none"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="text-sm text-gray-500">
                                                        {semester.subjects.length} môn • {semester.subjects.reduce((sum, s) => sum + parseFloat(s.credits || 0), 0)} tín chỉ • GPA: {calculateSemesterGPA(semester.subjects).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newName = prompt('Nhập tên học kỳ mới:', semester.name);
                                                        if (newName && newName.trim()) {
                                                            updateSemesterName(index, newName.trim());
                                                        }
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copySemester(index);
                                                    }}
                                                    className="text-gray-400 hover:text-blue-600"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteSemester(index);
                                                    }}
                                                    className="text-gray-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Subject Form */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm môn học mới</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên môn học</label>
                                    <input
                                        type="text"
                                        value={newSubject.name}
                                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập tên môn"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tín chỉ</label>
                                    <input
                                        type="number"
                                        value={newSubject.credits}
                                        onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="1, 2, 3..."
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Điểm GPA (0-4)</label>
                                    <input
                                        type="number"
                                        value={newSubject.grade}
                                        onChange={(e) => setNewSubject({ ...newSubject, grade: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.0-4.0"
                                        min="0"
                                        max="4"
                                        step="0.1"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={addSubject}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subject Management */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Bảng điểm {currentSemesterData?.name}
                                    </h2>
                                </div>
                                <div className="text-sm text-gray-500">
                                    GPA học kỳ: <span className="font-semibold text-blue-600">{currentGPA.toFixed(3)}</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Tên môn học</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Tín chỉ</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Điểm GPA</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSemesterData?.subjects.length > 0 ? (
                                            currentSemesterData.subjects.map((subject) => (
                                                <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="text"
                                                            value={subject.name}
                                                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Nhập tên môn học"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="number"
                                                            value={subject.credits}
                                                            onChange={(e) => updateSubject(subject.id, 'credits', e.target.value)}
                                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="number"
                                                            value={subject.grade}
                                                            onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            min="0"
                                                            max="4"
                                                            step="0.1"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button
                                                            onClick={() => deleteSubject(subject.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                                    Chưa có môn học nào. Thêm môn học đầu tiên của bạn!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-1">
                        {/* Current GPA */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Kết quả GPA</h3>
                            </div>

                            <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-gray-900">{currentGPA.toFixed(2)}</div>
                                <div className="text-sm text-blue-600">GPA học kỳ này</div>
                            </div>

                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-green-600">{cumulativeGPA.toFixed(2)}</div>
                                <div className="text-sm text-green-600">GPA tích lũy</div>
                            </div>

                            <div className="text-center mb-4">
                                <div className={`text-lg font-semibold ${academicStatus.color.includes('green') ? 'text-green-700' : academicStatus.color.includes('blue') ? 'text-blue-700' : academicStatus.color.includes('yellow') ? 'text-yellow-700' : academicStatus.color.includes('orange') ? 'text-orange-700' : 'text-red-700'}`}>
                                    {academicStatus.status}
                                </div>
                                <div className="text-sm text-gray-600">Học lực hiện tại</div>
                            </div>

                            <div className="text-center text-xs text-gray-500 border-t pt-4">
                                <div>Tổng: {totalSubjects} môn • {totalCredits} tín chỉ</div>
                            </div>
                        </div>

                        {/* Academic Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Tình trạng học lực</h3>
                            </div>

                            <div className={`rounded-lg p-4 border ${academicStatus.color}`}>
                                <div className="text-center">
                                    <div className="text-lg font-semibold">{academicStatus.status}</div>
                                    <div className="text-sm mt-1">
                                        GPA: {cumulativeGPA.toFixed(3)} (Thang 4)
                                    </div>
                                    <div className="text-sm">
                                        Khoảng: {academicStatus.range}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-xs text-gray-500">
                                <div className="font-medium mb-2">Thang điểm 4.0:</div>
                                <div className="space-y-1">
                                    <div>• 3.6-4.0: Xuất sắc</div>
                                    <div>• 3.2-3.59: Giỏi</div>
                                    <div>• 2.5-3.19: Khá</div>
                                    <div>• 2.0-2.49: Trung bình</div>
                                    <div>• 1.0-1.99: Yếu</div>
                                    <div>• 0.0-0.99: Kém</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GpaCalculator;
