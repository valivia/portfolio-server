import axios from "axios";

export default async function revalidate(url: string): Promise<void> {
    await axios.get(`${process.env.CLIENT_URL}/api/revalidate/${url}?secret=${process.env.CLIENT_SECRET}`)
        .then(x => console.log(x))
        .catch(x => console.log(x));
}