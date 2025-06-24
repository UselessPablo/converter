import React, { useState, useRef } from 'react';
import { Box, Button, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { CloudUpload, Delete, Download } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import potrace from 'potrace';

const ImageToSvgConverter = () => {
    const [image, setImage] = useState(null);
    const [svgData, setSvgData] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                setSvgData(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const convertToSvg = () => {
        if (!image) return;

        setIsConverting(true);

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

        potrace.trace(
            Buffer.from(base64Data, 'base64'),
            {
                color: 'currentColor',
                background: 'transparent',
                threshold: 120
            },
            (err, svg) => {
                if (err) {
                    console.error('Error al convertir:', err);
                    setIsConverting(false);
                    return;
                }
                setSvgData(svg);
                setIsConverting(false);
            }
        );
    };

    const downloadSvg = () => {
        if (!svgData) return;

        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted-image.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetAll = () => {
        setImage(null);
        setSvgData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <Container maxWidth="md" sx={{
            mt: 4,
            px: { xs: 1, sm: 2, md: 3 } // Ajuste de padding responsivo
        }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // Título responsivo
            }}>
                Conversor de Imagen a SVG
            </Typography>

            <Paper elevation={3} sx={{
                p: { xs: 2, sm: 3 }, // Padding responsivo
                mb: 3,
                overflow: 'hidden' // Para contener la imagen
            }}>
                <Typography variant="h6" gutterBottom sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' } // Tamaño responsivo
                }}>
                    Sube una imagen
                </Typography>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' } // Columna en móviles
                }}>
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUpload />}
                        fullWidth={window.innerWidth < 400} // Botón ancho en móviles
                    >
                        Seleccionar imagen
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                        />
                    </Button>

                    {image && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            fullWidth={window.innerWidth < 400} // Botón ancho en móviles
                            onClick={resetAll}
                        >
                            Eliminar
                        </Button>
                    )}
                </Box>

                {image && (
                    <Box sx={{
                        mt: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Vista previa:
                        </Typography>
                        <Box
                            component="img"
                            src={image}
                            alt="Preview"
                            sx={{
                                maxWidth: '100%',
                                maxHeight: { xs: '200px', sm: '300px' }, // Altura ajustable
                                width: 'auto',
                                height: 'auto',
                                display: 'block',
                                objectFit: 'contain' // Para mantener proporciones
                            }}
                        />
                    </Box>
                )}
            </Paper>

            {image && (
                <Paper elevation={3} sx={{
                    p: { xs: 2, sm: 3 }, // Padding responsivo
                    mb: 3
                }}>
                    <Typography variant="h6" gutterBottom sx={{
                        fontSize: { xs: '1.1rem', sm: '1.25rem' } // Tamaño responsivo
                    }}>
                        Convertir a SVG
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={convertToSvg}
                        disabled={isConverting}
                        sx={{ mb: 2 }}
                        fullWidth={window.innerWidth < 400} // Botón ancho en móviles
                    >
                        {isConverting ? (
                            <>
                                <CircularProgress size={24} sx={{ mr: 1 }} />
                                Convirtiendo...
                            </>
                        ) : 'Convertir a SVG'}
                    </Button>

                    {svgData && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                SVG resultante:
                            </Typography>
                            <Box
                                dangerouslySetInnerHTML={{ __html: svgData }}
                                sx={{
                                    border: '1px solid #ddd',
                                    p: 2,
                                    mb: 2,
                                    maxHeight: { xs: '200px', sm: '300px' }, // Altura ajustable
                                    overflow: 'auto',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    '& svg': {
                                        maxWidth: '100%',
                                        height: 'auto'
                                    }
                                }}
                            />

                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<Download />}
                                onClick={downloadSvg}
                                fullWidth={window.innerWidth < 400} // Botón ancho en móviles
                            >
                                Descargar SVG
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}
        </Container>
    );
};

export default ImageToSvgConverter;