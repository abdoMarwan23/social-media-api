import { BadRequestException, ConflictException, encryption, generateOTP, hash, NotFoundException, sendMail } from "../../common";
import { UserRepository } from "../../DB/models/user/user.repository";
import { deleteFromCash, getFromCash, setIntoCash } from "../../DB/redis.service";
import { ResetPasswordDTO, LoginDTO, SignupDTO, VerifyAccountDTO } from "./auth.dto";

class AuthService{

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }
    

    async signup(signupDTO: SignupDTO) {
        const { email } = signupDTO;

        const userExist = await this.userRepository.getOne({ email });
        if (userExist) throw new ConflictException("user already exists");

        signupDTO.password = await hash(signupDTO.password);

        if (signupDTO.phoneNumber) {
            signupDTO.phoneNumber = encryption(signupDTO.phoneNumber);
        }


        const otp = generateOTP();

        await sendMail({
            to: signupDTO.email,
            subject: "confirm E-mail",
            html:`<p>your otp confirmation is <h1>${otp}</h1></p>`,
        })


        await setIntoCash(`${signupDTO.email}:otp`, otp,  3 * 60 );


        await setIntoCash(`${signupDTO.email}`,JSON.stringify(signupDTO),3*24*60*60)
    }


    async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
        const userData = await getFromCash(verifyAccountDTO.email);
        if (!userData) throw new NotFoundException("user not found");

        const otp = await getFromCash(`${verifyAccountDTO.email}:otp`);
        if (!otp) throw new BadRequestException("expired otp");
        if (otp != verifyAccountDTO.otp) {
            throw new BadRequestException("invalid OTP");
        }

        await this.userRepository.create(JSON.parse(userData));

        await deleteFromCash(`${verifyAccountDTO.email}:otp`);
        await deleteFromCash(`${verifyAccountDTO.email}`);


    }

    async sendOTP(email: string) {
        const userExistInDB = await this.userRepository.getOne({ email });
        const userExistInCashe = await getFromCash(email);
        
        if (!userExistInCashe && !userExistInDB) {
            throw new NotFoundException("user not found, please signup");
        }

        const otpExist = await getFromCash(`${email}:otp`);
        if (otpExist) throw new BadRequestException("already have a valid OTP");

        const otp = generateOTP();
        await sendMail({
            to: email,
            subject: "Re-send OTP",
            html:`<p>your otp confirmation is <h1>${otp}</h1></p>`,
        })

        await setIntoCash(`${email}:otp`, otp, 3 * 60);
    }

    async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
        const userExist = await this.userRepository.getOne({  email:resetPasswordDTO.email });
        if (!userExist) throw new NotFoundException("user not found");


        const otp = await getFromCash(`${resetPasswordDTO.email}:otp`);
        if (otp != resetPasswordDTO.otp) throw new BadRequestException("invalid otp");


        resetPasswordDTO.newPassword = await hash(resetPasswordDTO.newPassword);

        await this.userRepository.updateOne({ email: resetPasswordDTO.email }, { password: resetPasswordDTO.newPassword });




    }
    login(loginDTO: LoginDTO) { }
}

export default new AuthService();