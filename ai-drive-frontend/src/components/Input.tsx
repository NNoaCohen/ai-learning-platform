import React from "react";

type InputProps = {
    label?: string;
    type?: string;
    name: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;

};

const Input: React.FC<InputProps> = ({ label, type = "text", name, value, placeholder, onChange, error }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
          px-4 py-2 rounded-lg border
          focus:outline-none focus:ring-2
          ${error
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-indigo-300"}
        `}
            />

        </div>
    );
}
export default Input;