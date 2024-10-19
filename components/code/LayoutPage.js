
const LayoutPage = (tbl, datas) => {

    const titleCase = (str) => {
        return str
            .split(' ')
            .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const replaceQutation = datas.replaceAll('`','');  
    const splitData = replaceQutation.split(",");
    const data = splitData.map(s => s.trim());


    let dd = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? dd = dd + `                                      <TextEn Title="${titleCase(d)}" Id="${d}" Change={(e) => set${titleCase(d)}(e.target.value)} Value={${d}} Chr="50" />`
                : dd = dd + `                                      <TextEn Title="${titleCase(d)}" Id="${d}" Change={(e) => set${titleCase(d)}(e.target.value)} Value={${d}} Chr="50" />\n`;
        }
    }
    );


    let stateVar = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? stateVar = stateVar + `      const [${d}, set${titleCase(d)}] = useState('');`
                : stateVar = stateVar + `      const [${d}, set${titleCase(d)}] = useState('');\n`
        }
    }
    );



    let stateClear = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? stateClear = stateClear + `          set${titleCase(d)}('');`
                : stateClear = stateClear + `          set${titleCase(d)}('');\n`
        }
    }
    );

    let getData = "";
    data.map((d, i) => {
        i === (data.length - 1)
            ? getData = getData + `set${titleCase(d)}(${d});`
            : getData = getData + `set${titleCase(d)}(${d});\n`
    }
    );


    let getValue = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? getValue = getValue + `              ${d}: ${d}`
                : getValue = getValue + `              ${d}: ${d},\n`
        }
    }
    );



    const str = `    import Layout from "@/components/Layout";
    
    
    export const metadata = {
      title: '${titleCase(tbl)}',
      description: 'Apps created by Aslam Zaman',
    }

   
    export default function ${titleCase(tbl)}Layout({ children }) {
        return <Layout>{children}</Layout>  
    }
  
    `;

    return str;
}

export default LayoutPage;