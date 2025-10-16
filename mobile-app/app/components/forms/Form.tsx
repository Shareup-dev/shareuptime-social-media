import React from 'react';
import { Formik, FormikConfig, FormikValues } from 'formik';
import type { ReactNode } from 'react';

interface AppFormProps<T extends FormikValues = FormikValues> {
  initialValues: T;
  onSubmit: FormikConfig<T>['onSubmit'];
  validationSchema?: FormikConfig<T>['validationSchema'];
  children: ReactNode;
}

const AppForm = <T extends FormikValues = FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}: AppFormProps<T>) => {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {() => <>{children}</>}
    </Formik>
  );
};

export default AppForm;
