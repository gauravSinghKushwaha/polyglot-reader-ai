export const Button: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (props) => {
    return (
        <button {...props} className={`basic-button ${props.className}`}/>
    )
}