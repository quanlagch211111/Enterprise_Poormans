import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MDBBtn,
  MDBInput,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { use } from "react";
import axios from "../../services/AxiosCustom";

const Account = () => {
  const accessToken = localStorage.getItem("accessToken")
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
    username: "",
    email: "",
    password: "",
    role: "Student",
  });

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
    setNewAccount({
      ...newAccount,
      [name]: value,
    });
  };

  const handleOpenNewAccountModal = () => {
    console.log("Opening new account modal");
    setShowModalNewAccount(true);
  };

  const handleCreateAccount = async () => {
    try {
      setIsLoading(true);
      // Giả lập tạo tài khoản mới
      setTimeout(() => {
        const newId = Math.floor(Math.random() * 1000).toString();
        const createdAccount = {
          _id: newId,
          ...newAccount,
          status: "active",
          created_at: new Date().toISOString(),
        };

        setAccounts([...accounts, createdAccount]);
        toast.success("Tạo tài khoản thành công!");
        setShowModalNewAccount(false);
        setNewAccount({
          username: "",
          email: "",
          password: "",
          role: "Student",
        });
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Không thể tạo tài khoản");
      setIsLoading(false);
    }
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
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
      <div className="main-content">
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
          <div className="body">
            <MDBTable className="rounded-2">
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
                {isLoading ? "processing..." : "Create account"}
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
              <h5 className="modal-title">Update Account</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModalEditAccount(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedAccount && (
                <>
                  <div className="form-group mb-3">
                    <label htmlFor="editUsername">User Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editUsername"
                      defaultValue={selectedAccount.username}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editEmail">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="editEmail"
                      defaultValue={selectedAccount.email}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editRole">Role</label>
                    <select
                      className="form-control"
                      id="editRole"
                      defaultValue={selectedAccount.role}
                    >
                      <option value="Student">Student</option>
                      <option value="Tutor">Tutor</option>
                      <option value="STAFF">Staff</option>
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="editStatus">Status</label>
                    <select
                      className="form-control"
                      id="editStatus"
                      defaultValue={selectedAccount.status}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
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
              <button type="button" className="btn btn-primary">
                Cập nhật
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
