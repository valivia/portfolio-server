import axios from "axios";

export default async function revalidate(url: string): Promise<void> {
    await axios.get(`${process.env.CLIENT_URL}/api/revalidate/${url}?secret=${process.env.CLIENT_SECRET}`)
        .catch(() => console.log("Failed to revalidate"));
}