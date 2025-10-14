import React from 'react'
import { useFormikContext } from "formik";
import DatePicker from 'react-native-date-picker'


export default function AppDatePicker({  name,...otherProps}) {

    const {
        setFieldTouched,
        setFieldValue,
        errors,
        touched,
        values,
      } = useFormikContext();
    return (
        <DatePicker
        date={values[name].toString()}
        onDateChange={setFieldValue}
        {...otherProps}
      />
    )
}
