// eslint-disable-next-line import/no-anonymous-default-export
export default () => ({
  root: ({ collapsed }) => ({
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    minHeight: 32,
    '-webkit-font-smoothing': 'antialiased',
    padding: collapsed ? '0px 6px' : '0 12px 0 26px',
    width: collapsed ? 32 : 'auto',
    borderRadius: collapsed ? 20 : 0,
    overflow: collapsed ? 'hidden' : 'visible',
    marginLeft: collapsed ? 20 : '',
    fontSize: 14,
    '& > svg:first-child': {
      marginRight: 18,
      fontSize: 20,
      opacity: 0.54,
    },
    '& .MuiLabel-amount': {
      fontSize: '0.75rem',
      letterSpacing: 0.3,
      marginLeft: 'auto',
      paddingLeft: 16,
    },
  }),
});