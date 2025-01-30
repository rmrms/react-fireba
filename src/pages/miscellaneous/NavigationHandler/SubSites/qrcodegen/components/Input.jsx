export function Input(prps) {
  return (
    <input type={prps.type} onChange={prps.handleOnClick} {...prps}>
      {prps.text}
    </input>
  )
}