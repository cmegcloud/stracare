async function loadReceivables(){

    const snap =
    await getDocs(
        collection(
            db,
            "receivables"
        )
    );

    state.receivables = [];

    snap.forEach(row => {

        state.receivables.push({

            id: row.id,

            ...row.data()

        });

    });

    renderReceivables();

}

function renderReceivables(){

    const tbody =
    document.getElementById(
        "receivableTable"
    );

    tbody.innerHTML = "";

    state.receivables.forEach(r => {

        tbody.innerHTML += `

        <tr>

            <td>${r.mobile}</td>

            <td>${r.patientName}</td>

            <td>${r.branch}</td>

            <td>

                ₹${r.balance}

            </td>

            <td>

                ${r.lastVisit || "-"}

            </td>

            <td>

                <button
                    onclick="openLedger('${r.mobile}')">

                    Ledger

                </button>

            </td>

        </tr>

        `;

    });

    updateReceivableCards();

}

function updateReceivableCards(){

    const total =

    state.receivables.reduce(

        (sum,row)=>

        sum + Number(
            row.balance || 0
        ),

        0

    );

    document.getElementById(
        "totalReceivable"
    ).innerText =

        "₹" + total;

    document.getElementById(
        "totalReceivablePatients"
    ).innerText =

        state.receivables.length;

}

async function createReceivable(

    mobile,
    patientName,
    branch,
    amount

){

    await setDoc(

        doc(
            db,
            "receivables",
            mobile
        ),

        {

            mobile,

            patientName,

            branch,

            balance: amount,

            lastVisit:
                new Date()
                .toISOString()
                .split("T")[0]

        },

        {

            merge:true

        }

    );

}

async function increaseReceivable(

    mobile,
    amount

){

    const snap =

    await getDoc(

        doc(
            db,
            "receivables",
            mobile
        )

    );

    if(!snap.exists())
        return;

    const oldBal =

    Number(
        snap.data().balance || 0
    );

    await updateDoc(

        doc(
            db,
            "receivables",
            mobile
        ),

        {

            balance:
                oldBal + amount

        }

    );

}

function openLedger(mobile){

    alert(

        "Open Ledger for : " +

        mobile

    );

}