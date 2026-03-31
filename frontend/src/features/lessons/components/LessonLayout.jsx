const LessonLayout = ({ children, sidebar }) => {
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        
        {/* Left: Video / Content */}
        <Box sx={{ flex: 1, bgcolor: "#000" }}>
          {children}
        </Box>
  
        {/* Right: Sidebar */}
        <Box sx={{ width: 320, borderLeft: "1px solid #eee" }}>
          {sidebar}
        </Box>
  
      </Box>
    );
  };

  export default LessonLayout;