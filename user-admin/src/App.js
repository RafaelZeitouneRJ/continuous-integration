import * as React from "react";
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserCreate, UserEdit, UserList } from "./Users";

const dataProvider = jsonServerProvider('http://localhost:4000');
const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit} />
    </Admin>
);

export default App;