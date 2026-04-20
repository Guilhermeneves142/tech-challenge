type IconProps = {
    className?: string;
};

export function DeleteIcon({ className }: IconProps) {
    return (
        <svg 
            className={className}
            viewBox="0 0 27 27"  fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M8.5 21C8.04167 21 7.64931 20.8368 7.32292 20.5104C6.99653 20.184 6.83333 19.7917 6.83333 19.3333V8.5H6V6.83333H10.1667V6H15.1667V6.83333H19.3333V8.5H18.5V19.3333C18.5 19.7917 18.3368 20.184 18.0104 20.5104C17.684 20.8368 17.2917 21 16.8333 21H8.5ZM16.8333 8.5H8.5V19.3333H16.8333V8.5ZM10.1667 17.6667H11.8333V10.1667H10.1667V17.6667ZM13.5 17.6667H15.1667V10.1667H13.5V17.6667ZM8.5 8.5V19.3333V8.5Z" fill="#171717" />
        </svg>

    );
}