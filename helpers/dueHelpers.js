import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";

export const dataDues = async (isNameAsc) => {

    try {
        const yrs = sessionStorage.getItem('yr');
        const [customers, sales, payments, cashtypes] = await Promise.all([
            getDataFromFirebase('customer'),
            getDataFromFirebase('sale'),
            getDataFromFirebase('payment'),
            getDataFromFirebase('cashtype')
        ]);


        const result = customers.map(customer => {
            const matchingSale = sales.filter(sale => (parseInt(sale.yrs) === parseInt(yrs) && sale.customerId === customer.id));
            const matchingPayment = payments.filter(payment => (parseInt(payment.yrs) === parseInt(yrs) && payment.customerId === customer.id));

            const totalSale = matchingSale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
            const totalPayment = matchingPayment.reduce((t, c) => t + parseFloat(c.taka), 0);
                        
            const balance = totalSale - totalPayment;
            const isDues = balance > 0 ? true : false;
            return {
                ...customer,
                balance,
                isDues,
                matchingSale,
                matchingPayment
            };
        });



        const sortResult = result.sort((a, b) => {
            if (isNameAsc) {
                return sortArray(a.name.toUpperCase(), b.name.toUpperCase());
            } else {
                return sortArray(b.balance, a.balance);
            }
        });

        const totalTaka = result.reduce((t, c) => t + parseFloat(c.balance), 0);

        return { sortResult, yrs, totalTaka };


    } catch (error) {
        console.error("Error fetching data:", error);
    }
};


