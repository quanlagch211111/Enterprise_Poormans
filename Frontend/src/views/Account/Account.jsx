import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MDBBtn,
  MDBInput,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import { FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { use } from "react";
import axios from "../../services/AxiosCustom";

import CreateAccountModal from "./CreateAccountModal";

const Account = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "STAFF"; // Mặc định role là STAFF để hiển thị nút Add
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisibilityId, setVisibilityId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [showModalNewAccount, setShowModalNewAccount] = useState(false);
  const [showModalEditAccount, setShowModalEditAccount] = useState(false);
  const [showModalDeleteAccount, setShowModalDeleteAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = accessToken; // Lấy token từ localStorage hoặc state
    if (!token) {
      navigate("/login"); // Chuyển hướng đến trang đăng nhập nếu không có token
    }
    fetchUsersWithRoles(); // Gọi hàm lấy danh sách người dùng với vai trò
  }, []);

  const fetchUsersWithRoles = async () => {
    try {
      const response = await axios.get("/users/getuserwithroles", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("response:", response);
      setAccounts(response.data);
      console.log("account:", accounts);
    } catch (error) {
      console.error("Error fetching users with roles:", error);
    }
  };
  // Form state for new account
  const [newAccount, setNewAccount] = useState({
    _id: "",
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    isVerified: false,
    role: "Student", // Default role
    additionalInfo: {
      grade: "", // Specific for Student
      major: "", // Specific for Student
      department: "", // Specific for Staff
      position: "", // Specific for Staff
      expertise: "", // Specific for Tutor
      yearsOfExperience: "", // Specific for Tutor
    },
  });

  const handleRoleChange = (e) => {
    setNewAccount({ ...newAccount, role: e.target.value });
  };

  // Debug log khi state showModalNewAccount thay đổi
  useEffect(() => {
    console.log("showModalNewAccount changed to:", showModalNewAccount);
  }, [showModalNewAccount]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleVisibility = (id) => {
    setVisibilityId(isVisibilityId === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("additionalInfo")) {
      const field = name.split(".")[1];
      setNewAccount({
        ...newAccount,
        additionalInfo: {
          ...newAccount.additionalInfo,
          [field]: value,
        },
      });
    } else {
      setNewAccount({
        ...newAccount,
        [name]: value,
      });
    }
  };

  const handleOpenNewAccountModal = () => {
    console.log("Opening new account modal");
    setShowModalNewAccount(true);
  };

  const handleCreateAccount = async () => {
    try {
      setIsLoading(true);

      // Chuẩn bị dữ liệu theo đúng định dạng yêu cầu
      const requestData = {
        username: newAccount.username,
        email: newAccount.email,
        password: newAccount.password,
        address: newAccount.address,
        phone: newAccount.phone,
        role: newAccount.role.toLowerCase(), // Chuyển role thành chữ thường
        additionalInfo: newAccount.additionalInfo, // Bao gồm thông tin bổ sung tùy theo role
      };

      const response = await axios.post(
        "http://localhost:3001/api/users/signup",
        requestData
      );

      if (response.status === 201) {
        toast.success("Tạo tài khoản thành công!");
        fetchUsersWithRoles();
        setShowModalNewAccount(false);
        setNewAccount({
          _id: "",
          username: "",
          email: "",
          password: "",
          address: "",
          phone: "",
          isVerified: false,
          role: "Student",
          additionalInfo: {
            grade: "",
            major: "",
            department: "",
            position: "",
            expertise: "",
            yearsOfExperience: "",
          },
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Không thể tạo tài khoản");
      setIsLoading(false);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      console.log("Updating account:", newAccount);
      setIsLoading(true);
      const response = await axios.put(
        `http://localhost:3001/api/users/update/${newAccount._id}`,
        newAccount,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        fetchUsersWithRoles();
        toast.success("Tài khoản đã được cập nhật!");
        setShowModalEditAccount(false);
        fetchUsersWithRoles(); // Fetch the updated list of users
        setIsLoading(false);
        setNewAccount({
          _id: "",
          username: "",
          email: "",
          password: "",
          address: "",
          phone: "",
          isVerified: false,
          role: "Student",
          additionalInfo: {
            grade: "",
            major: "",
            department: "",
            position: "",
            expertise: "",
            yearsOfExperience: "",
          },
        });
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Không thể cập nhật tài khoản");
      setIsLoading(false);
    }
  };

  const handleEditAccount = (account) => {
    console.log("Editing account:", account);
    setNewAccount({
      _id: account._id,
      username: account.username,
      email: account.email,
      password: account.password,
      address: account.address,
      phone: account.phone,
      isVerified: account.isVerified,
      role: account.role,
      additionalInfo: {
        grade: account.grade,
        major: account.major,
        department: account.department,
        position: account.position,
        expertise: account.expertise,
        yearsOfExperience: account.yearsOfExperience,
      },
    });
    setShowModalEditAccount(true);
  };

  const handleDeleteAccount = (account) => {
    setAccountToDelete(account);
    setShowModalDeleteAccount(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;

    try {
      setIsLoading(true);
      const respone = await axios.delete(
        `/users/delete/${accountToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (respone.status === 200) {
        setTimeout(() => {
          fetchUsersWithRoles();
          toast.success("Xóa tài khoản thành công!");
          setShowModalDeleteAccount(false);
          setAccountToDelete(null);
          setIsLoading(false);
        }, 800);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Không thể xóa tài khoản");
      setIsLoading(false);
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <div className="main-content pb-5">
        <div className="account-page">
          <div className="header bg-white p-3 rounded-1 d-flex justify-content-between align-items-center mb-4 gap-2">
            <MDBInput
              label="Search"
              id="searchInput"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
            />
            {role === "STAFF" && (
              <MDBBtn onClick={handleOpenNewAccountModal}>Add</MDBBtn>
            )}
          </div>
          <div className="body mb-5">
            <MDBTable responsive="sm" className="rounded-2">
              <MDBTableHead className="table-header rounded-2">
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table-body bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Đang tải...
                    </td>
                  </tr>
                ) : filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Không tìm thấy tài khoản
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar me-3">
                            <div
                              className="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                              style={{ width: 40, height: 40 }}
                            >
                              <FaUser />
                            </div>
                          </div>
                          {account.username}
                        </div>
                      </td>
                      <td>{account.email}</td>
                      <td>{account.role}</td>
                      <td>
                        <span
                          className={`badge ${
                            account.status === true
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {account.status === true
                            ? "Verified"
                            : "Not Verified"}
                        </span>
                      </td>
                      <td>
                        {new Date(account.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="dropdown-assignment">
                          <div className="container-select d-flex justify-content-end">
                            <div
                              className="dropdown-select d-flex align-items-center justify-content-center"
                              onClick={() => toggleVisibility(account._id)}
                            >
                              <img
                                src={require("../../assets/images/more.png")}
                                alt=""
                              />
                            </div>
                          </div>
                          <ul
                            className={
                              "dropdown-list d-flex gap-2 flex-column " +
                              (isVisibilityId === account._id ? "active" : "")
                            }
                          >
                            <li
                              className="dropdown-item"
                              onClick={() => handleDeleteAccount(account)}
                            >
                              Delete
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={() => handleEditAccount(account)}
                            >
                              Update
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </MDBTableBody>
            </MDBTable>
          </div>
        </div>
      </div>

      {/* Model Create */}
      <div
        className={`modal fade ${showModalNewAccount ? "show" : ""}`}
        style={{ display: showModalNewAccount ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!showModalNewAccount}
      >
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
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={newAccount.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={newAccount.phone}
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

              {/* Display additional fields based on role */}
              {newAccount.role === "Student" && (
                <>
                  <div className="form-group mb-3">
                    <label htmlFor="grade">Grade</label>
                    <input
                      type="text"
                      className="form-control"
                      id="grade"
                      name="additionalInfo.grade"
                      value={newAccount.additionalInfo.grade}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="major">Major</label>
                    <input
                      type="text"
                      className="form-control"
                      id="major"
                      name="additionalInfo.major"
                      value={newAccount.additionalInfo.major}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              {newAccount.role === "Staff" && (
                <>
                  <div className="form-group mb-3">
                    <label htmlFor="department">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      id="department"
                      name="additionalInfo.department"
                      value={newAccount.additionalInfo.department}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="position">Position</label>
                    <input
                      type="text"
                      className="form-control"
                      id="position"
                      name="additionalInfo.position"
                      value={newAccount.additionalInfo.position}
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
                      name="additionalInfo.expertise"
                      value={newAccount.additionalInfo.expertise}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="yearsOfExperience">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="yearsOfExperience"
                      name="additionalInfo.yearsOfExperience"
                      value={newAccount.additionalInfo.yearsOfExperience}
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
                onClick={handleCreateAccount}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModalNewAccount && <div className="modal-backdrop fade show"></div>}

      {/* Edit Account Modal */}
      <div
        className={`modal fade ${showModalEditAccount ? "show" : ""}`}
        style={{ display: showModalEditAccount ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!showModalEditAccount}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cập nhật tài khoản</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModalEditAccount(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {newAccount && (
                <>
                  <div className="form-group mb-3">
                    <label htmlFor="editUsername">Tên người dùng</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editUsername"
                      name="username"
                      value={newAccount.username || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editEmail">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="editEmail"
                      name="email"
                      value={newAccount.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editPhone">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editPhone"
                      name="phone"
                      value={newAccount.phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editAddress">Địa chỉ</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editAddress"
                      name="address"
                      value={newAccount.address || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editRole">Vai trò</label>
                    <select
                      className="form-control"
                      id="editRole"
                      name="role"
                      value={newAccount.role || ""}
                      onChange={handleInputChange}
                    >
                      <option value="Student">Student</option>
                      <option value="Tutor">Tutor</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editVerified">Xác minhh</label>
                    <select
                      className="form-control"
                      id="editVerified"
                      name="isVerified"
                      value={newAccount.isVerified || false}
                      onChange={handleInputChange}
                    >
                      <option value={true}>Có</option>
                      <option value={false}>Không</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModalEditAccount(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateAccount}
                disabled={isLoading}
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModalEditAccount && <div className="modal-backdrop fade show"></div>}

      {/* Delete Account Confirmation Modal */}
      <div
        className={`modal fade ${showModalDeleteAccount ? "show" : ""}`}
        style={{ display: showModalDeleteAccount ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!showModalDeleteAccount}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Confirm</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModalDeleteAccount(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete your account?{" "}
              <strong>{accountToDelete?.username}</strong>? This action cannot
              be undone.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModalDeleteAccount(false)}
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? "processing..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModalDeleteAccount && (
        <div className="modal-backdrop fade show"></div>
      )}
    </>
  );
};

export default Account;
