//const API_URL = "http://127.0.0.1:8000/usuarios";

const API_URL = "https://pf25-carlos-db-302016834907.europe-west1.run.app/usuarios";

// funcion para obtener y mostrar los usuarios en la tabla
async function cargarUsuarios() {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>cargando usuarios...</td></tr>";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("error al obtener usuarios");

        const usuarios = await response.json();
        tableBody.innerHTML = "";

        if (usuarios.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>no hay usuarios registrados</td></tr>";
            return;
        }

        usuarios.forEach(user => {
            agregarFilaUsuario(user);
        });

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center; color:red;'>error al cargar usuarios</td></tr>";
    }
}

// funcion para registrar un nuevo usuario
document.getElementById("userForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;

    const userData = { nombre, email, dni, fecha_nacimiento };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error("error al registrar usuario");

        // agrega la nueva fila directamente
        agregarFilaUsuario(userData);

        alert("usuario registrado correctamente");
        document.getElementById("userForm").reset();

    } catch (error) {
        console.error(error);
        alert("error: " + error.message);
    }
});

// funcion para actualizar un usuario
async function actualizarUsuario(dni, button) {
    const row = button.closest("tr");
    const updatedData = {
        nombre: row.cells[0].innerText,
        email: row.cells[1].innerText,
        fecha_nacimiento: row.cells[3].innerText
    };

    try {
        const response = await fetch(`${API_URL}/${dni}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error("error al actualizar usuario");

        // actualiza la fila directamente
        actualizarFilaUsuario(dni, updatedData);

        alert("usuario actualizado correctamente");

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// funcion para eliminar un usuario
async function eliminarUsuario(dni) {
    try {
        const response = await fetch(`${API_URL}/${dni}`, { method: "DELETE" });
        if (!response.ok) throw new Error("error al eliminar usuario");

        // elimina la fila directamente
        eliminarFilaUsuario(dni);

    } catch (error) {
        alert("error: " + error.message);
        console.error(error);
    }
}

// funcion para agregar una fila de usuario a la tabla
function agregarFilaUsuario(user) {
    const tableBody = document.getElementById("userTableBody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td contenteditable="true">${user.nombre}</td>
        <td contenteditable="true">${user.email}</td>
        <td>${user.dni}</td>
        <td contenteditable="true">${user.fecha_nacimiento}</td>
        <td>
            <button class="update-btn" onclick="actualizarUsuario('${user.dni}', this)">actualizar</button>
            <button class="delete-btn" onclick="eliminarUsuario('${user.dni}')">eliminar</button>
        </td>
    `;
    tableBody.appendChild(row);
}

// funcion para actualizar una fila de usuario en la tabla
function actualizarFilaUsuario(dni, updatedData) {
    const tableBody = document.getElementById("userTableBody");
    const rows = tableBody.getElementsByTagName("tr");

    for (let row of rows) {
        if (row.cells[2].innerText === dni) { // busca la fila por el dni
            row.cells[0].innerText = updatedData.nombre;
            row.cells[1].innerText = updatedData.email;
            row.cells[3].innerText = updatedData.fecha_nacimiento;
            break;
        }
    }
}

// funcion para eliminar una fila de usuario de la tabla
function eliminarFilaUsuario(dni) {
    const tableBody = document.getElementById("userTableBody");
    const rows = tableBody.getElementsByTagName("tr");

    for (let row of rows) {
        if (row.cells[2].innerText === dni) { // busca la fila por el dni
            tableBody.removeChild(row);
            break;
        }
    }
}

// cargar usuarios al iniciar la pagina
cargarUsuarios();
