export function Button(prps) {
  
  return (
    <button onClick={prps.handleOnClick} {...prps}>{prps.text}</button>
  )
}