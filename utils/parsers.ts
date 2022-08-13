export const tcpFlagsParser = (flag: string) => {
  switch (flag) {
    case '1':
      return 'FIN'
    case '2':
      return 'SYN'
    case '4':
      return 'RST'
    case '8':
      return 'PSH'
    case '16':
      return 'ACK'
    case '18':
      return 'SYN-ACK'
    case '32':
      return 'URG'
    default:
      return flag
  }
}

export const protocolParser = (proto: string) => {
  switch (proto) {
    case '0':
      return 'HOPOPT'
    case '1':
      return 'ICMP'
    case '6':
      return 'TCP'
    case '17':
      return 'UDP'
    case '33':
      return 'DCCP'
    case '37':
      return 'DDP'
    case '58':
      return 'ICMP6'
    default:
      return proto
  }
}
