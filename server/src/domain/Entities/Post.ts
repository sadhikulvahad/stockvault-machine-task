import { Types } from "mongoose";
import { PostProps } from "../Types/EntityProps";


export class Post {
    private props: PostProps

    constructor(props: PostProps) {
        if (!props.authorId || !props.imageUrl) {
            throw new Error("autherId and image are required");
        }
        this.props = props;
    }

    get _id(): string {
        if (!this.props._id) {
            return ''
        }
        return this.props._id
    }

    get title(): string | undefined {
        return this.props.title;
    }

    get authorId(): Types.ObjectId {
        return this.props.authorId;
    }

    get imageUrl(): string | undefined {
        return this.props.imageUrl;
    }

    get imagePosition(): Number {
        return this.props.imagePosition
    }

    get isDeleted () : Boolean {
        return this.props.isDeleted
    }

    toJson(): PostProps {
        return {
            _id: this.props._id,
            title: this.props.title,
            authorId: this.props.authorId,
            imageUrl: this.props.imageUrl,
            imagePosition: this.props.imagePosition,
            isDeleted : this.props.isDeleted
        }
    }

}