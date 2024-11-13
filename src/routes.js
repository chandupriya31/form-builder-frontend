import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FormList from './components/List';
import CreateForm from './components/Create-form';
import View from './components/View-Form';

function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<FormList />} />
            <Route path='/form/create' element={<CreateForm />} />
            <Route path='/form/edit/:id' element={<CreateForm />} />
            <Route path='/form/view/:id' element={<View />} />
        </Routes>
    );
}

export default AppRoutes;
