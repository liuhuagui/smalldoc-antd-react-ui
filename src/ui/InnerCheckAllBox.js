import React from 'react';

const labelCheckedClassName = "ant-checkbox-wrapper ant-checkbox-wrapper-checked";
const spanCheckedClassName = "ant-checkbox ant-checkbox-checked";
const spanIndeterminateClassName = "ant-checkbox ant-checkbox-indeterminate ant-checkbox-checked";

export default ({ indeterminate, onChange, checked, children }) => {
    let labelClassName = "ant-checkbox-wrapper";
    let spanClassName = "ant-checkbox";
    if (indeterminate || checked)
        labelClassName = labelCheckedClassName;
    if (indeterminate)
        spanClassName = spanIndeterminateClassName;
    if (checked)
        spanClassName = spanCheckedClassName;
    return (<label className={labelClassName}>
        <span className={spanClassName}>
            <input type="checkbox" className="ant-checkbox-input" value="" onChange={onChange} />
            <span className="ant-checkbox-inner"></span>
        </span>
        <span>{children}</span>
    </label>);
};

