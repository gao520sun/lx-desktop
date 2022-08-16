
import { random } from 'lodash'
import React, { useEffect, useState } from 'react'

function VodList() {
  const [rId,setRid] = useState(0)
  useEffect(() => {
    setRid(random(100))
  },[])
  return (
    <div>
      <div>id:{rId}</div>
    </div>
  )
}

export default VodList