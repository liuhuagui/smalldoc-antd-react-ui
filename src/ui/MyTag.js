import React, { createContext, useContext } from 'react';
import { Tag } from 'antd';

const MyTagContext = createContext({ value: null, onChange() { } });
const MyTag = ({ value, color, children }) => {
    const { value: value0, onChange } = useContext(MyTagContext);
    const checked = value0 === value;
    const onClick = () => onChange(value);
    return checked ? <Tag.CheckableTag checked={checked} children={children} /> : <Tag onClick={onClick} color={color} children={children} />
}

MyTag.Group = ({ children, ...otherProps }) => {
    return <MyTagContext.Provider value={otherProps}><span>{children}</span></MyTagContext.Provider>
}

export default MyTag;
