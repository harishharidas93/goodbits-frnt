import React, { useState, useRef, useEffect } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import EmployeeService from "../services/employee.service";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const validEmail = value => {
    if (!(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value))) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const shouldBeNumber = (value) => {
    if (!(/[0-9]/.test(value))) {
        return (
            <div className="alert alert-danger" role="alert">
                Number only
            </div>
        );
    }
};

const shouldBeTenDigit = (value) => {
    if (value.length !== 10) {
        return (
            <div className="alert alert-danger" role="alert">
                Mobile number should be of 10 digits
            </div>
        );
    }
};

const Dashboard = () => {
    const [message, setMessage] = useState("");
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            setMessage('Unauthorized Access');
        }
    }, []);

    const form = useRef();
    const checkBtn = useRef();

    const [emp_id, setEmpId] = useState("");
    const [emp_email, setEmail] = useState("");
    const [emp_name, setEmpName] = useState("");
    const [emp_age, setEmpAge] = useState("");
    const [emp_address, setEmpAddress] = useState("");
    const [emp_mob, setEmpMob] = useState("");
    const [successful, setSuccessful] = useState(false);

    const onChangeEmpId = (e) => {
        const emp_id = e.target.value;
        setEmpId(emp_id);
    };
    const onChangeEmpName = (e) => {
        const emp_name = e.target.value;
        setEmpName(emp_name);
    };
    const onChangeEmpAge = (e) => {
        const emp_age = e.target.value;
        setEmpAge(emp_age);
    };
    const onChangeEmpAddress = (e) => {
        const emp_address = e.target.value;
        setEmpAddress(emp_address);
    };
    const onChangeEmpMob = (e) => {
        const emp_mob = e.target.value;
        setEmpMob(emp_mob);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);
        form.current.validateAll();
        if (checkBtn.current.context._errors.length === 0) {
            EmployeeService.addEmployeeDetail(emp_id, emp_name, emp_email, emp_age, emp_address, emp_mob).then(
                () => {
                    setSuccessful(true);
                    alert('Data Added')
                    window.location.reload();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessage(resMessage);
                }
            );
        } else {
            setSuccessful(false);
        }
    };
    return (
        <div className="col-md-12">
            <div className="card card-container">
                <h1>Dashboard</h1>
                <Form onSubmit={handleRegister} ref={form}>
                    {message !== 'Unauthorized Access' && (
                        <div>
                            <div className="form-group">
                                <label htmlFor="emp_id">Employee Id</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="emp_id"
                                    value={emp_id}
                                    onChange={onChangeEmpId}
                                    validations={[required, shouldBeNumber]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emp_name">Name</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="emp_name"
                                    value={emp_name}
                                    onChange={onChangeEmpName}
                                    validations={[required]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emp_email">Email</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="emp_email"
                                    value={emp_email}
                                    onChange={onChangeEmail}
                                    validations={[required, validEmail]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emp_age">Age</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="emp_age"
                                    value={emp_age}
                                    onChange={onChangeEmpAge}
                                    validations={[required, shouldBeNumber]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emp_address">Address</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="emp_address"
                                    value={emp_address}
                                    onChange={onChangeEmpAddress}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emp_mob">Mobile No.</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="emp_mob"
                                    value={emp_mob}
                                    onChange={onChangeEmpMob}
                                    validations={[required, shouldBeNumber, shouldBeTenDigit]}
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-block">Add</button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );
};

export default Dashboard;