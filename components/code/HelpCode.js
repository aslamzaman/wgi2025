const Help_code = (tbl) => {
  const titleCase = (str) => {
    return str
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

const url_1 = "`${process.env.NEXT_PUBLIC_URL}/employee/read_all`";
const url_2 = "`${process.env.NEXT_PUBLIC_URL}/gender/read_all`";

  const str = `
    *** Server:-
    app.use('/${tbl}', require('./src/routes/${titleCase(tbl)}Route'));


    *** Menu:-
    <MenuItem Click={() => setMenu(false)} Href="/${tbl}" Title="${titleCase(tbl)}" />


    *** Promise.all:-
    const [employee, gender] = await Promise.all([
      axios.get(${url_1}),
      axios.get(${url_2})
    ]); 

    const employeeData = employee.data;
    const genderData = gender.data; 

    const result = employeeData.map(employee => {
      const matchGender  = genderData.find(gender => parseInt(gender.id) === parseInt(employee.gender_id));
      return {
        ...employee,
        gender: matchGender  ? matchGender .name : 'Error!'
      }
    })  
    
    console.log(employeeData, genderData, result);  
    setEmployees(result);
  

    *** Reduce:-
    const result = datas.reduce((total, data) => {
        const taka = parseFloat(data.taka);
        const nos = parseFloat(data.nos);
        return total + (taka * nos) ;
      }, 0);
      
      
 *** Filter1:-
 const result = staffs.filter(staff => parseInt(staff.place_id) === 1699884047193); // return array    
 
 
 *** Filter2:- (some)
 const result = customers.filter(customer=> payments.some(payment =>payment.customer._id === customer._id));
 const result = orders.filter(order=> !delivery.some(delivery =>delivery.orderNo === order.orderNo));
 

 *** Filter3:- (Range)
 const filteredValue = data.filter(item => item.Price >= 230 && item.Price <= 800);

 
 *** Find:-
 const result = staffs.find(s => parseInt(s.place_id) === 1699884047193); // return object


*** Sort-1:-
const SortResult = datas.sort((a, b) => {
    if (parseInt(a.id) < parseInt(b.id)) {
      return -1;
    } else {
      return 1;
    }
  });
*** Sort-2:
const sortPost = responsePost.sort((a, b) => (a.nmEn).toUpperCase() < (b.nmEn).toUpperCase() ? -1 : 1);


  *** PDF Multiple Page:-
  const printMultiplePageHandler = async () => {
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });

    const margin = 15;
    const itemsPerPage = 12;
    let y = margin;
    doc.setFontSize(12);

    for (let i = 0; i < staffs.length; i++) {       
        doc.text(\`\${staffs[i].post}\`, 105, y + 12, null, null, "center");   
        y = y + 23;        
        if (i % itemsPerPage === itemsPerPage - 1) {               
            doc.addPage();                
            y = margin;
        }
    }

    doc.save(\`\${Date.now()}-staff.pdf\`);
    Msg("Print completed.");
    setShow(false);
}


*** Create PDF Page From Canvas:-
const createPdfHandler = async (e) => {
  e.preventDefault();

  const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16 // or "smart", default is 16
  });

  const pageText = pageRef.current;
  try {
      const canvas = await html2canvas(pageText);
      const dataUrl = canvas.toDataURL('images/png');
      console.log(dataUrl);
      doc.addImage(dataUrl, "PNG", 0, 0, 210, 297);
      doc.save(new Date().toISOString() + "-Bayprostab.pdf");
  }
  catch (err) {
      console.log(err);
  }
}


*** Components Arrays:-
export const MyComponents = [
  () => {
      return <h1>Component</h1>;
  },
  () => {
      return (
          <>
             <h1>Header</h1>;
             <p>Paragraph</p>;
          </>
      );
  }
]


*** Object:-
export const Lib = {
  url:"Some thing",
  dateFormatBn(dt) {   
    return 'Some thing';
  }, 
  price: {
    some:some;
  }
}


*** Interval:-
let i = 0;
const myTimer = setInterval(() => {
  console.log(data[i].name);
  i = i + 1;
  if (i >= data.length) {
      clearInterval(myTimer);
  }
}, 1000)

      `;

  return str;

}

export default Help_code;