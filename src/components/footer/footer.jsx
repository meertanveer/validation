

const Footer = () => {
  return (
    <div className="bg-green-800 h-10 flex text-white items-center justify-center gap-2">
        <div>Excel Pro</div>
        <p className="flex items-center justify-center space-x-2">
        <span>&copy;</span>
        <span>{new Date().getFullYear()}</span>
      </p>
    </div>

    
  )
}

export default Footer