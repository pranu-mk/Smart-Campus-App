const studentService = require('../services/studentService');

exports.getStudents = async (req, res) => {
    try {
        const students = await studentService.getAllStudents();
        res.status(200).json({ 
            success: true, 
            data: students 
        });
    } catch (error) {
        console.error("Error in getStudents:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudentComplaints = async (req, res) => {
    try {
        const complaints = await studentService.getStudentComplaints(req.params.id);
        res.status(200).json({ 
            success: true, 
            data: complaints 
        });
    } catch (error) {
        console.error("Error in getStudentComplaints:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStudentDetails = async (req, res) => {
    try {
        await studentService.updateStudent(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Student updated successfully" });
    } catch (error) {
        console.error("Error in updateStudentDetails:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};