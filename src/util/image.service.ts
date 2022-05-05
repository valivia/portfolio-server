import fs from "fs";
import sharp from "sharp";
import theme from "node-vibrant";
import ServerErrorException from "../exceptions/serverError";
import { Palette } from "../../node_modules/@vibrant/color/lib/index";

export default class ImageService {
    private buffer;
    private metadata: MetaData;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
        this.createMetaData();
    }

    private async createMetaData() {
        const sharpBuffer = sharp(this.buffer);
        this.metadata = await sharpBuffer.metadata() as MetaData;
        if (!this.metadata.width || !this.metadata.height) throw new ServerErrorException();
    }

    public async resizeImage(scale: number, square = false): Promise<Buffer> {
        if (scale < 0.1 || scale > 1) throw { message: `Wrong scale size ${scale}`, type: `RESIZE_ERROR` };
        try {
            if (!this.metadata) await this.createMetaData();

            const metadata = this.metadata;

            if (square) {
                metadata.height = metadata.width = Math.min(metadata.height, metadata.width);
            }

            const width = Math.round(metadata.width as number * scale);
            const height = Math.round(metadata.height as number * scale);

            console.log(`${width} x ${height}`);

            const output = await sharp(this.buffer)
                .withMetadata({ exif: { IFD0: { Copyright: process.env.AUTHOR } } })
                .jpeg({ mozjpeg: true })
                .resize(width, height)
                .toBuffer();


            return output;
        } catch (err) {
            throw {
                err,
                message: "Failed to resize the assets",
                type: "RESIZE_ERROR",
            };
        }
    }

    public async resizeImageAbs(totalPix: number, square = false): Promise<Buffer> {
        if (totalPix < 1 || totalPix > 10000000000) throw { message: `Wrong scale size ${totalPix}`, type: `RESIZE_ERROR` };
        try {
            if (!this.metadata) await this.createMetaData();

            const metadata = this.metadata;
            // scale is the square root of the totalPix wanted over the original image size
            // but limited to a maximum of 1 to prevent upscaling
            let scale = Math.min(1, Math.sqrt(totalPix / (metadata.width as number * metadata.height as number)));

            if (square) {
                // set both width and height to the minimum of the two
                metadata.height = metadata.width = Math.min(metadata.height, metadata.width);
                // set scale to 1 for correct width and height calculation in the next step
                scale = 1;
            }

            const width = Math.round(metadata.width as number * scale);
            const height = Math.round(metadata.height as number * scale);

            console.log(`${width} x ${height}`);

            const output = await sharp(this.buffer)
                .withMetadata({ exif: { IFD0: { Copyright: process.env.AUTHOR } } })
                .jpeg({ mozjpeg: true })
                .resize(width, height)
                .toBuffer();


            return output;
        } catch (err) {
            throw {
                err,
                message: "Failed to resize the assets",
                type: "RESIZE_ERROR",
            };
        }
    }

    public async makeAssets(fileName: string): Promise<boolean> {
        try {

            const path = `./media/content/${fileName}`;
            await Promise.all([
                fs.promises.writeFile(`./media/archive/${fileName}.jpg`, this.buffer),
                this.resizeImageAbs(3840 * 2160).then(data => fs.promises.writeFile(`${path}_default.jpg`, data)),
                this.resizeImageAbs(2560 * 1440).then(data => fs.promises.writeFile(`${path}_high.jpg`, data)),
                this.resizeImageAbs(1920 * 1080).then(data => fs.promises.writeFile(`${path}_medium.jpg`, data)),
                this.resizeImageAbs(720 * 480).then(data => fs.promises.writeFile(`${path}_low.jpg`, data)),
                this.resizeImageAbs(480 * 240).then(data => fs.promises.writeFile(`${path}_lowest.jpg`, data)),
                this.resizeImageAbs(1, true).then(data => fs.promises.writeFile(`${path}_square.jpg`, data)),
            ]);

            return true;
        } catch (err) {
            throw {
                err,
                message: `Failed to save the resized assets.`,
                type: `WRITE_ERROR`,
            };
        }
    }

    public async getMetadata(): Promise<MetaData> {
        if (!this.metadata) await this.createMetaData();
        return this.metadata;
    }

    public async getTheme(): Promise<Palette> {
        return await theme.from(this.buffer).getPalette();
    }
}

interface MetaData extends sharp.Metadata {
    height: number;
    width: number;
}