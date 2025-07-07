import { type FileWithPath } from 'react-dropzone';
interface ImageUploadProps {
    /** The current URL of the image to display. */
    value: string | null;
    /** Callback fired when a file is dropped or selected. */
    onDrop: (acceptedFiles: FileWithPath[]) => void;
    /** Callback fired when the remove button is clicked. */
    onRemove: () => void;
    /** Whether the component is in a loading state. */
    isUploading?: boolean;
    /** Whether the component is disabled. */
    disabled?: boolean;
    /** Error message to display. */
    uploadError?: string | null;
}
export declare function ImageUpload({ value, onDrop, onRemove, isUploading, disabled, uploadError, }: ImageUploadProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=image-upload.d.ts.map