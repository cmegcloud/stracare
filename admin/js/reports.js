function dailyCollectionReport(){

    const tbody =
    document.getElementById(
        "reportBody"
    );

    tbody.innerHTML = "";

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    const data =

    state.receipts.filter(

        r =>

        r.receiptDate === today

    );

    data.forEach(row => {

        tbody.innerHTML += `

        <tr>

            <td>${row.receiptNo}</td>

            <td>${row.patientName}</td>

            <td>${row.mode}</td>

            <td>₹${row.amount}</td>

        </tr>

        `;

    });

}

function branchCollectionReport(){

    const summary = {};

    state.receipts.forEach(r => {

        if(!summary[r.branch])

            summary[r.branch] = 0;

        summary[r.branch] +=
            Number(r.amount);

    });

    renderSummary(summary);

}

function doctorCollectionReport(){

    const summary = {};

    state.appointments.forEach(a => {

        if(
            !a.consultedDoctor
        ) return;

        if(
            !summary[
                a.consultedDoctor
            ]
        )
        {
            summary[
                a.consultedDoctor
            ] = 0;
        }

        summary[
            a.consultedDoctor
        ]++;

    });

    renderSummary(summary);

}

function receivableReport(){

    const summary = {};

    state.receivables.forEach(r => {

        summary[
            r.patientName
        ] =

        r.balance;

    });

    renderSummary(summary);

}

function cashVsUpiReport(){

    let cash = 0;
    let upi = 0;

    state.receipts.forEach(r => {

        if(r.mode === "Cash")
            cash += Number(r.amount);

        if(r.mode === "UPI")
            upi += Number(r.amount);

    });

    alert(

        "Cash : ₹" +

        cash +

        "\nUPI : ₹" +

        upi

    );

}

function appointmentReport(){

    alert(

        "Total Appointments : " +

        state.appointments.length

    );

}

function profitLossReport(){

    const income =

    state.receipts.reduce(

        (sum,r)=>

        sum +
        Number(r.amount),

        0

    );

    const expense =

    state.payments.reduce(

        (sum,p)=>

        sum +
        Number(p.amount),

        0

    );

    const profit =

    income - expense;

    alert(

        "Income : ₹" +
        income +

        "\nExpense : ₹" +
        expense +

        "\nProfit : ₹" +
        profit

    );

}

function renderSummary(data){

    const tbody =
    document.getElementById(
        "reportBody"
    );

    tbody.innerHTML = "";

    Object.keys(data)
    .forEach(key => {

        tbody.innerHTML += `

        <tr>

            <td>${key}</td>

            <td>${data[key]}</td>

        </tr>

        `;

    });

}

function exportExcel(){

    alert(
        "Excel Export Module"
    );

}
