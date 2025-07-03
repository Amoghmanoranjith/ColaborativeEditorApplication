const customStyles2 = {
  container: (provided) => ({
    ...provided,
    width: '24rem',
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#000' : '#ccc',
    boxShadow: state.isFocused ? '0 0 0 2px black' : 'none',
    fontFamily: 'Lexend, sans-serif',
    borderRadius: '8px',
    padding: '2px 4px',
    minHeight: '36px',
    color: '#000',
    width: '24rem',
    transition: 'all 0.2s ease-in-out',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? '#000'
      : state.isSelected
      ? '#333'
      : '#fff',
    color: state.isFocused || state.isSelected ? '#fff' : '#000',
    fontFamily: 'Lexend, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    ':hover': {
      backgroundColor: '#000',
      color: '#fff',
      transform: 'scale(1.02)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    maxWidth: '24rem',
    backgroundColor: '#fff',
    boxShadow: '0px 6px 16px rgba(0,0,0,0.15)',
    zIndex: 20,
    overflow: 'hidden',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    overflowY: 'auto',
    overflowX: 'hidden', // ✅ no horizontal scroll
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE 10+
    '::-webkit-scrollbar': {
      display: 'none', // Chrome/Safari
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000',
    fontFamily: 'Lexend, sans-serif',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#888',
    fontFamily: 'Lexend, sans-serif',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#000',
    ':hover': {
      color: '#000',
      transform: 'scale(1.1)',
    },
  }),
};

export default customStyles2;
