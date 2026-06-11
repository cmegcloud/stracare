async function savePayment() {

    const payment = {

        paymentNo:
            "PY" + Date.now(),

        vendor:
            document.getElementById(
                "paymentVendor"
            ).value,

        expenseHead:
            document.getElementById(
                "paymentHead"
            ).value,

        amount:
            Number(
                document.getElementById(
                    "paymentAmount"
                ).value
            ),

        mode:
            document.getElementById(
                "paymentMode"
            ).value,

        branch:
            document.getElementById(
                "paymentBranch"
            ).value,

        paymentDate:
            document.getElementById(
                "paymentDate"
            ).value,

        remarks:
            document.getElementById(
                "paymentRemarks"
            ).value,

        createdAt:
            serverTimestamp()

    };

    await addDoc(
        collection(db,"payments"),
        payment
    );

    alert("Payment Saved");

    loadPayments();

}

async function loadPayments() {

    const snap =
        await getDocs(
            collection(
                db,
                "payments"
            )
        );

    state.payments = [];

    snap.forEach(row => {

        state.payments.push({

            id: row.id,

            ...row.data()

        });

    });

    renderPayments();

}

function renderPayments() {

    const tbody =
        document.getElementById(
            "paymentTable"
        );

    tbody.innerHTML = "";

    state.payments.forEach(p => {

        tbody.innerHTML += `

        <tr>

            <td>${p.paymentNo}</td>

            <td>${p.paymentDate}</td>

            <td>${p.vendor}</td>

            <td>${p.expenseHead}</td>

            <td>${p.mode}</td>

            <td>₹${p.amount}</td>

        </tr>

        `;

    });

}

// Dashboard Totals

function getTodayExpenses() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    return state.payments
        .filter(
            p =>
            p.paymentDate === today
        )
        .reduce(
            (sum,p)=>
            sum + Number(p.amount),
            0
        );

}

function getMonthExpenses() {

    const month =
        new Date()
        .toISOString()
        .substring(0,7);

    return state.payments
        .filter(
            p =>
            p.paymentDate
            .startsWith(month)
        )
        .reduce(
            (sum,p)=>
            sum + Number(p.amount),
            0
        );

}