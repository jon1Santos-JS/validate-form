import { ChangeEvent } from 'react';

export default function PerfilImage() {
    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        console.log(file);

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/testConnection', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Image uploaded successfully!');
        } else {
            console.error('Error uploading image.');
        }
    };

    return (
        <div>
            <h4>Image Upload</h4>
            <input type="file" onChange={handleFileUpload} accept="image/*" />
        </div>
    );
}
