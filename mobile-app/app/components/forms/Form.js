import React from "react";
import { StyleSheet } from "react-native";
import { Formik } from "formik"; // for making forms easily "installed formik@2.1.4"

export default function AppForm({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => <>{children}</>}
    </Formik>
  );
}

const styles = StyleSheet.create({});
