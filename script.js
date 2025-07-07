class GPACalculator {
    constructor() {
        this.subjects = [];
        this.initializeEventListeners();
        this.updateResults();
    }

    initializeEventListeners() {
        const addBtn = document.getElementById('addSubject');
        const inputs = ['subjectName', 'credits', 'grade'];

        addBtn.addEventListener('click', () => this.addSubject());

        // Cho phép thêm môn học bằng phím Enter
        inputs.forEach(inputId => {
            document.getElementById(inputId).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addSubject();
                }
            });
        });
    }

    addSubject() {
        const name = document.getElementById('subjectName').value.trim();
        const credits = parseFloat(document.getElementById('credits').value);
        const grade = parseFloat(document.getElementById('grade').value);

        // Kiểm tra dữ liệu đầu vào
        if (!name) {
            alert('Vui lòng nhập tên môn học!');
            return;
        }

        if (!credits || credits <= 0 || credits > 10) {
            alert('Vui lòng nhập số tín chỉ hợp lệ (1-10)!');
            return;
        }

        if (isNaN(grade) || grade < 0 || grade > 4) {
            alert('Vui lòng nhập điểm GPA hợp lệ (0-4)!');
            return;
        }

        // Tạo đối tượng môn học
        const subject = {
            id: Date.now(), // ID đơn giản dựa trên timestamp
            name: name,
            credits: credits,
            grade: grade,
            gpa4: grade // Điểm đã là GPA thang 4
        };

        // Thêm vào danh sách
        this.subjects.push(subject);

        // Cập nhật giao diện
        this.renderSubjects();
        this.updateResults();
        this.clearInputs();
    }

    convertToGPA4(grade10) {
        // Quy đổi từ thang 10 sang thang 4
        if (grade10 >= 8.5) return 4.0;      // A (8.5-10)
        if (grade10 >= 8.0) return 3.7;      // A- (8.0-8.4)
        if (grade10 >= 7.0) return 3.3;      // B+ (7.0-7.9)
        if (grade10 >= 6.5) return 3.0;      // B (6.5-6.9)
        if (grade10 >= 5.5) return 2.7;      // B- (5.5-6.4)
        if (grade10 >= 5.0) return 2.3;      // C+ (5.0-5.4)
        if (grade10 >= 4.0) return 2.0;      // C (4.0-4.9)
        if (grade10 >= 3.0) return 1.7;      // C- (3.0-3.9)
        if (grade10 >= 2.0) return 1.3;      // D+ (2.0-2.9)
        if (grade10 >= 1.0) return 1.0;      // D (1.0-1.9)
        return 0.0;                           // F (0-0.9)
    }

    getLetterGrade(grade10) {
        if (grade10 >= 8.5) return 'A';
        if (grade10 >= 8.0) return 'A-';
        if (grade10 >= 7.0) return 'B+';
        if (grade10 >= 6.5) return 'B';
        if (grade10 >= 5.5) return 'B-';
        if (grade10 >= 5.0) return 'C+';
        if (grade10 >= 4.0) return 'C';
        if (grade10 >= 3.0) return 'C-';
        if (grade10 >= 2.0) return 'D+';
        if (grade10 >= 1.0) return 'D';
        return 'F';
    }

    getLetterGradeFromGPA(gpa4) {
        if (gpa4 >= 3.7) return 'A';
        if (gpa4 >= 3.3) return 'A-';
        if (gpa4 >= 3.0) return 'B+';
        if (gpa4 >= 2.7) return 'B';
        if (gpa4 >= 2.3) return 'B-';
        if (gpa4 >= 2.0) return 'C+';
        if (gpa4 >= 1.7) return 'C';
        if (gpa4 >= 1.3) return 'C-';
        if (gpa4 >= 1.0) return 'D+';
        if (gpa4 >= 0.7) return 'D';
        return 'F';
    }

    deleteSubject(id) {
        this.subjects = this.subjects.filter(subject => subject.id !== id);
        this.renderSubjects();
        this.updateResults();
    }

    renderSubjects() {
        const container = document.getElementById('subjectsList');

        if (this.subjects.length === 0) {
            container.innerHTML = '<p class="empty-message">Chưa có môn học nào. Hãy thêm môn học đầu tiên!</p>';
            return;
        }

        const subjectsHTML = this.subjects.map(subject => `
            <div class="subject-item">
                <div class="subject-name">${subject.name}</div>
                <div class="subject-credits">${subject.credits} tín chỉ</div>
                <div class="subject-grade">${subject.grade.toFixed(1)} (${this.getLetterGradeFromGPA(subject.grade)})</div>
                <div class="subject-gpa">${subject.gpa4.toFixed(1)}</div>
                <button class="delete-btn" onclick="calculator.deleteSubject(${subject.id})">
                    🗑️ Xóa
                </button>
            </div>
        `).join('');

        container.innerHTML = subjectsHTML;
    }

    updateResults() {
        const totalCredits = this.subjects.reduce((sum, subject) => sum + subject.credits, 0);
        const totalGradePoints4 = this.subjects.reduce((sum, subject) => sum + (subject.gpa4 * subject.credits), 0);

        const gpa4 = totalCredits > 0 ? totalGradePoints4 / totalCredits : 0;

        // Cập nhật hiển thị
        document.getElementById('totalCredits').textContent = totalCredits;
        document.getElementById('gpa4').textContent = gpa4.toFixed(2);

        // Cập nhật phân loại
        this.updateClassification(gpa4);
    }

    updateClassification(gpa) {
        const classificationElement = document.getElementById('classification');
        let classification, className;

        if (gpa >= 3.6) {
            classification = '🏆 Xuất Sắc';
            className = 'excellent';
        } else if (gpa >= 3.2) {
            classification = '🌟 Giỏi';
            className = 'good';
        } else if (gpa >= 2.5) {
            classification = '👍 Khá';
            className = 'average';
        } else if (gpa >= 2.0) {
            classification = '📚 Trung Bình';
            className = 'below-average';
        } else if (gpa > 0) {
            classification = '📖 Yếu';
            className = 'poor';
        } else {
            classification = 'Chưa có dữ liệu';
            className = '';
        }

        classificationElement.textContent = classification;
        classificationElement.className = `classification ${className}`;
    }

    clearInputs() {
        document.getElementById('subjectName').value = '';
        document.getElementById('credits').value = '';
        document.getElementById('grade').value = '';
        document.getElementById('subjectName').focus();
    }

    // Phương thức để lưu và tải dữ liệu từ localStorage
    saveData() {
        localStorage.setItem('gpaCalculatorData', JSON.stringify(this.subjects));
    }

    loadData() {
        const savedData = localStorage.getItem('gpaCalculatorData');
        if (savedData) {
            this.subjects = JSON.parse(savedData);
            this.renderSubjects();
            this.updateResults();
        }
    }

    // Xuất dữ liệu ra file
    exportData() {
        const data = {
            exportDate: new Date().toISOString(),
            subjects: this.subjects,
            summary: {
                totalCredits: this.subjects.reduce((sum, subject) => sum + subject.credits, 0),
                gpa4: this.subjects.length > 0 ?
                    (this.subjects.reduce((sum, subject) => sum + (subject.gpa4 * subject.credits), 0) /
                        this.subjects.reduce((sum, subject) => sum + subject.credits, 0)).toFixed(2) : 0
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gpa-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Reset toàn bộ dữ liệu
    resetAll() {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu không?')) {
            this.subjects = [];
            this.renderSubjects();
            this.updateResults();
            this.saveData();
        }
    }
}

// Khởi tạo ứng dụng khi trang web được tải
let calculator;

document.addEventListener('DOMContentLoaded', function () {
    calculator = new GPACalculator();
    calculator.loadData();

    // Lưu dữ liệu tự động khi có thay đổi
    window.addEventListener('beforeunload', function () {
        calculator.saveData();
    });

    // Thêm các phím tắt
    document.addEventListener('keydown', function (e) {
        // Ctrl+S để lưu dữ liệu
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            calculator.saveData();
            alert('Dữ liệu đã được lưu!');
        }

        // Ctrl+E để xuất dữ liệu
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            calculator.exportData();
        }

        // Ctrl+R để reset (với xác nhận)
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            calculator.resetAll();
        }
    });
});

// Thêm tooltip cho các phím tắt
document.addEventListener('DOMContentLoaded', function () {
    const shortcuts = document.createElement('div');
    shortcuts.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 8px; font-size: 12px; z-index: 1000;">
            <div><strong>Phím tắt:</strong></div>
            <div>Ctrl+S: Lưu dữ liệu</div>
            <div>Ctrl+E: Xuất dữ liệu</div>
            <div>Ctrl+R: Reset tất cả</div>
            <div>Enter: Thêm môn học</div>
        </div>
    `;
    document.body.appendChild(shortcuts);

    // Ẩn tooltip sau 5 giây
    setTimeout(() => {
        shortcuts.style.opacity = '0.3';
    }, 5000);

    // Hiện lại khi hover
    shortcuts.addEventListener('mouseenter', () => {
        shortcuts.style.opacity = '1';
    });

    shortcuts.addEventListener('mouseleave', () => {
        shortcuts.style.opacity = '0.3';
    });
});
