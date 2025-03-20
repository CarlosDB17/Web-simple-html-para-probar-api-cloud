//const API_URL = "http://127.0.0.1:8000/usuarios";

const API_URL = "https://pf25-carlos-db-302016834907.europe-west1.run.app/usuarios";

// funcion para obtener y mostrar los usuarios en la tabla
async function cargarUsuarios() {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Cargando usuarios...</td></tr>";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener usuarios");

        const usuarios = await response.json();
        tableBody.innerHTML = "";

        if (usuarios.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No hay usuarios registrados</td></tr>";
            return;
        }

        usuarios.forEach(user => {
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
        });

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center; color:red;'>Error al cargar usuarios</td></tr>";
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

        if (!response.ok) throw new Error("Error al registrar usuario");

        cargarUsuarios();
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

        if (!response.ok) throw new Error("Error al actualizar usuario");
        cargarUsuarios();
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
        if (!response.ok) throw new Error("Error al eliminar usuario");

        cargarUsuarios();

    } catch (error) {
        alert("error: " + error.message);
        console.error(error);
    }
}

// cargar usuarios al iniciar la pagina
cargarUsuarios();
