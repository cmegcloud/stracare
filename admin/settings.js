async function saveClinicSettings(){

    await setDoc(

        doc(
            db,
            "settings",
            "clinic"
        ),

        {

            clinicName:
            document.getElementById(
                "clinicName"
            ).value,

            mobile:
            document.getElementById(
                "clinicMobile"
            ).value,

            email:
            document.getElementById(
                "clinicEmail"
            ).value,

            website:
            document.getElementById(
                "clinicWebsite"
            ).value,

            address:
            document.getElementById(
                "clinicAddress"
            ).value

        }

    );

    alert(
        "Settings Saved"
    );

}

async function saveBranch(){

    await addDoc(

        collection(
            db,
            "branches"
        ),

        {

            branchName:
            document.getElementById(
                "branchName"
            ).value,

            branchCode:
            document.getElementById(
                "branchCode"
            ).value,

            mobile:
            document.getElementById(
                "branchMobile"
            ).value

        }

    );

    loadBranches();

}

async function loadBranches(){

    const snap =

    await getDocs(

        collection(
            db,
            "branches"
        )

    );

    const tbody =

    document.getElementById(
        "branchTable"
    );

    tbody.innerHTML = "";

    snap.forEach(row => {

        const data =
        row.data();

        tbody.innerHTML += `

        <tr>

            <td>
                ${data.branchName}
            </td>

            <td>
                ${data.branchCode}
            </td>

            <td>
                ${data.mobile}
            </td>

            <td>

                Delete

            </td>

        </tr>

        `;

    });

}

async function saveUser(){

    await addDoc(

        collection(
            db,
            "users"
        ),

        {

            name:
            document.getElementById(
                "userName"
            ).value,

            email:
            document.getElementById(
                "userEmail"
            ).value,

            role:
            document.getElementById(
                "userRole"
            ).value,

            branch:
            document.getElementById(
                "userBranch"
            ).value

        }

    );

    alert(
        "User Saved"
    );

}