import Layout from "@/components/Layout";
    
    
export const metadata = {
  title: 'Post',
  description: 'Apps created by Aslam Zaman',
}


export default function PostLayout({ children }) {
    return <Layout>{children}</Layout>  
}

