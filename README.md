## Run

1. `yarn run server`
2. Import postman_collection.json of root directory to POSTMAN. or Check swagger ui address: http://localhost:5000/docs/
3. This project is using JWT authentication, request almost every API should provided Token.

## Test

`yarn test`

## DATA SSTRUCTURE:

```sh
Doc
    - [Field]
    - [Container]
        - Field
```

## DATA MODEL DESIGN:

```js
User {
    name:string,
    id:string,
}
Doc {
    [Field] onetomany
    [Container] onetomany
}
Container {
    [Field]
    ViewPermissions [User] onetomany
    EditPermissions [User] onetomany
    OwnerId - User.id
}
Field {
    name: string,
    value: string,
    ViewPermissions [User] onetomany
    EditPermissions [User] onetomany
    OwnerId - User.id
}
```

## TASK LIST DESCRIPTION:

1. Create User API ✔️
2. Login API ✔️
3. Global Token Authentication ✔️
4. Global Error Handling Middleware ✔️
5. Doc/Field/Container/User Models ✔️
6. Doc create API ✔️
7. Doc view API（According to the authority to display the Field/Container） ✔️
8. Field create API（put Field into Container and Doc after created） ✔️
9. Field view API ✔️
10. Field update API (Check whether the operation can be performed according to the authority) ✔️
11. Field delete API (Check whether the operation can be performed according to the authority) ✔️
12. Container create API ✔️
13. Container view API ✔️
14. Container update API(Check whether the operation can be performed according to the authority) ✔️
15. Container delete API(Check whether the operation can be performed according to the authority) ✔️
16. API description document (Swagger) ✔️
17. Test coverage > 75%
18. Set view and update permissions for user ✔️
