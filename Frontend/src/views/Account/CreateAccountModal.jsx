import { useState, useEffect } from "react";

const CreateAccountModal = ({ showModalNewAccount, setShowModalNewAccount, handleCreateAccount, isLoading }) => {
  const [newAccount, setNewAccount] = useState({
    username: "",
    email: "",
    password: "",
    role: "Student",
    grade: "",
    major: "",
    expertise: "",
    yearsOfExperience: "",
    department: "",
    position: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create new account</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModalNewAccount(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="form-group mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={newAccount.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={newAccount.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={newAccount.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="role">Role</label>
              <select
                className="form-control"
                id="role"
                name="role"
                value={newAccount.role}
                onChange={handleInputChange}
              >
                <option value="Student">Student</option>
                <option value="Tutor">Teacher</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>
            {newAccount.role === "Student" && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="grade">Grade</label>
                  <input
                    type="text"
                    className="form-control"
                    id="grade"
                    name="grade"
                    value={newAccount.grade}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="major">Major</label>
                  <input
                    type="text"
                    className="form-control"
                    id="major"
                    name="major"
                    value={newAccount.major}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
            {newAccount.role === "Tutor" && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="expertise">Expertise</label>
                  <input
                    type="text"
                    className="form-control"
                    id="expertise"
                    name="expertise"
                    value={newAccount.expertise}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="yearsOfExperience">Years of Experience</label>
                  <input
                    type="number"
                    className="form-control"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={newAccount.yearsOfExperience}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
            {newAccount.role === "STAFF" && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    name="department"
                    value={newAccount.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="position">Position</label>
                  <input
                    type="text"
                    className="form-control"
                    id="position"
                    name="position"
                    value={newAccount.position}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModalNewAccount(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleCreateAccount(newAccount)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Create Account"}
            </button>
          </div>
        </div>
      </div>
  );
};

export default CreateAccountModal;
