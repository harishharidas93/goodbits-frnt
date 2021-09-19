import React, { useEffect, useState, useRef } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import EmployeeService from "../services/employee.service";
import AuthService from "../services/auth.service";

const View = () => {
    const [gridApi, setGridApi] = useState(null);
    const searchForm = useRef(null)
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            setMessage('Unauthorized Access');
        } else {
            EmployeeService.getAllEmployees().then(
                (data) => {
                    setSuccessful(true)
                    const { employee_details } = data.data
                    setRowData(employee_details)
                },
                (error) => {
                    setMessage('Error occured')
                }
            );
        }
    }, [])
    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const deleteRows = e => {
        const selectedNodes = gridRef.current.api.getSelectedNodes()
        if (selectedNodes.length === 0) {
            alert('No rows selected')
            return false
        }
        const selectedData = selectedNodes.map(node => node.data)
        EmployeeService.deleteEmployee(selectedData[0].emp_id).then(
            (data) => {
                const modifiedEmployeeDetails = rowData.filter(x => x.emp_id !== selectedData[0].emp_id)
                setRowData(modifiedEmployeeDetails)
            },
            (error) => {
                alert('Error occured while deleting')
            }
        );
    }

    const handleEdit = e => {
        const colField = e.colDef.field
        const newValue = e.newValue
        const newData = e.data
        let message;
        switch (colField) {
            case 'emp_name': if (!newValue) message = 'This field is required'
                break;
            case 'emp_email': if (!newValue) message = 'This field is required'
            else if (!(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(newValue))) message = 'Invalid email'
                break;
            case 'emp_age': if (!newValue) message = 'This field is required'
            else if (!(/[0-9]/.test(newValue))) message = 'Only number is valid'
                break;
            case 'emp_mob': if (!newValue) message = 'This field is required'
            else if (newValue.length !== 10)
                break;
        }
        if (message) {
            alert(message)
            gridApi.undoCellEditing();
        } else {
            EmployeeService.updateEmployee(newData.emp_id, colField, newValue).then(
                (data) => {
                    const modifiedEmployeeDetails = rowData.map(x => {
                        if (x.emp_id !== newData.emp_id)
                            return x
                        else return newData
                    })
                    setRowData(modifiedEmployeeDetails)
                },
                (error) => {
                    alert('Error occured while deleting')
                }
            );
        }
    }

    const searchRecords = e => {
        e.preventDefault();
        const search_column = searchForm.current['search_column'].value
        const search_value = searchForm.current['search_value'].value
        if (!search_value) {
            alert('Please enter value')
            return
        }
        let message;
        switch (search_column) {
            case 'emp_email': if (!(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(search_value))) message = 'Invalid email'
                break;
            case 'emp_age' || 'emp_id': if (!(/[0-9]/.test(search_value))) message = 'Only number is valid'
                break;
            case 'emp_mob': if (search_value.length !== 10)
                break;
        }
        if (message) {
            alert(message)
            gridApi.undoCellEditing();
        } else {
            EmployeeService.searchForEmployee(search_column, search_value).then(
                (data) => {
                    const { employee_details } = data.data
                    setRowData(employee_details)
                },
                (error) => {
                    alert('Error occured while searching')
                }
            );
        }
        console.log(search_column, search_value)
    }

    return (
        <div>
            {message !== 'Unauthorized Access' && successful &&
                (<div>
                    <div className='searchRecords'>
                        <h1>Search</h1>
                        <p>Please enter your criteria and value to be searched: </p>
                        <form className="form-inline" onSubmit={searchRecords} ref={searchForm}>
                            <label for="option">Option:</label>
                            <select defaultValue='emp_id' name='search_column'>
                                <option value="emp_id">Employee Id</option>
                                <option value="emp_name">Employee Name</option>
                                <option value="emp_email">Employee Mail</option>
                                <option value="emp_age">Age</option>
                                <option value="emp_mob">Mobile:</option>
                            </select>
                            <label for="value">Value:</label>
                            <input type="text" name={'search_value'} />
                            <button type="submit" value="Submit" className='button'>Submit</button>
                        </form>

                    </div>
                    <button onClick={deleteRows} className='button'>Delete selected rows</button>
                    <div className="ag-theme-alpine" style={{ height: 400 }}>

                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            onGridReady={onGridReady}
                            undoRedoCellEditing={true}
                        >
                            <AgGridColumn field="emp_id" checkboxSelection={true}></AgGridColumn>
                            <AgGridColumn editable={true} onCellValueChanged={handleEdit} field="emp_name"></AgGridColumn>
                            <AgGridColumn editable={true} onCellValueChanged={handleEdit} field="emp_email"></AgGridColumn>
                            <AgGridColumn editable={true} onCellValueChanged={handleEdit} field="emp_age"></AgGridColumn>
                            <AgGridColumn editable={true} onCellValueChanged={handleEdit} field="emp_address"></AgGridColumn>
                            <AgGridColumn editable={true} onCellValueChanged={handleEdit} field="emp_mob"></AgGridColumn>
                        </AgGridReact>
                    </div></div>)}

            {message && (
                <div className="form-group">
                    <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                        {message}
                    </div>
                </div>
            )}
        </div>
    );
};

export default View;