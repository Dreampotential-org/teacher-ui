$(document).ready(function () {
    $("#left-sidebar").load("sidebar.html");
    $("#page-header").load("header.html");
    const urlParams = getUrlParams();

    lesson_id = urlParams.get("lesson_id");
    $('#lesson-name').text(lesson_id);
    fetchPaymentDataForLesson(lesson_id);
});

const getUrlParams = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
};

const fetchPaymentDataForLesson = (lessonId) => {
    console.log("Fetching payment data for id: " + lessonId);
    $.get(
        `${SERVER}store_stripe/payments/${lessonId}/`,
        function (data, status) {
            if (status === "success") {

                data?.data?.map((d, index) => {
                    $("#payment-body").append(
                        getTableRow(index+1, d?.user, d?.amount, d?.status)
                    );
                });
                return;
            }
            console.log("Error fetching data: " + status);
        }
    );
};

const getTableRow = (count, user, amount, status) => {
    return `
    <tr>
        <th scope="row">${count}</th>
        <td>${user}</td>
        <td>${amount / 100}</td>
        <td>${status}</td>
    </tr>
    `;
};
