import { UserProps } from "../Types/EntityProps";


export class User {
    private props: UserProps
    constructor(props: UserProps) {
        if (!props.phone || !props.email) {
            throw new Error("All fields are required");
        }

        this.props = props;
    }

    get _id(): string {
        if(!this.props._id) {
            throw new Error("ID is not set");
        }
        return this.props._id;
    }

    get phone(): string {
        return this.props.phone;
    }

    get email(): string {
        return this.props.email;
    }

    get password(): string {
        if(!this.props.password) {
            throw new Error("Password is not set");
        }
        return this.props.password;
    }

    toJson(): UserProps {
        return {
            _id: this.props._id,
            phone: this.props.phone,
            email: this.props.email,
        }
    }
}