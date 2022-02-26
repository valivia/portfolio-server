import twoFa from "speakeasy";
import qrCode from "qrcode";

class TwoFactorAuth {
    private secret: string;
    private auth_url: string

    constructor() {
        this.secret = process.env.TFA_SECRET ? process.env.TFA_SECRET : this.genSecret();
        this.auth_url = twoFa.otpauthURL({ secret: this.secret, label: "Portfolio", issuer: "Owl Corp" });

        if (process.env.NODE_ENV == "development") console.log(this.secret);
    }

    private genSecret = () => {
        return twoFa.generateSecret().base32;
    }

    public validate = (token: string): boolean => {
        return twoFa.totp.verify({
            secret: this.secret,
            encoding: "ascii",
            token: token,
        });
    }

    public getQRUrl = async (): Promise<string> => {
        let qr = await qrCode.toDataURL(this.auth_url);
        qr = `<img src="${qr}">`;

        return qr;
    }

}

declare const global: NodeJS.Global & { twoFaService?: TwoFactorAuth };


const twoFaService: TwoFactorAuth = global.twoFaService || new TwoFactorAuth();

if (process.env.NODE_ENV === "development") global.twoFaService = twoFaService;

export default twoFaService;