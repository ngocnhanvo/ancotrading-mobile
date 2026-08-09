import React, { useState, useEffect } from 'react';
import {Text, View as ViewM} from 'react-native';
import { usePagination, isCurrentPage } from './src/hooks/usePagination';
import { PaginationButton } from './src/PaginationButton';
import { PaginationSideButtons } from './src/PaginationSideButtons';
import View from '../../native-base-theme/components/View';
const Pagination = ({ totalItems, pageSize = 1, pagesToDisplay = 3, onPageChange, showLastPagesButtons = false, currentPage, containerStyle = {}, btnStyle = {}, textStyle = {}, activeBtnStyle = null, activeTextStyle = null, onLayout = null}) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const pagination = usePagination(totalItems, pageSize, pagesToDisplay, currentPage);

    useEffect(() => {
        if (currentPage < 1) {
            onPageChange(1);
        }
        else if (currentPage > totalPages) {
            onPageChange(totalPages);
        }
    }, [currentPage, totalPages, onPageChange]);
    const handleChangePage = (page) => {
        if (page !== '...') {
            onPageChange(parseInt(page, 10));
        }
    };
    return (<PaginationSideButtons {...{
        totalPages,
        currentPage,
        handleChangePage,
        showLastPagesButtons,
        containerStyle,
        btnStyle,
        textStyle,
        onLayout
    }}>
        {
            pagination.map((pag, index) => {
                let fontSt = {}, btnSt = {};
                if(pag.length > 2 & pag !== "...") {
                    fontSt.fontSize = 12;
                    btnSt.paddingLeft = 8;
                    btnSt.paddingRight = 8;
                    fontSt.top = 3;
                }
                return pag !== "..." ? (
                <ViewM key={index}>
                    <PaginationButton btnStyle={[btnStyle, btnSt]} textStyle={[textStyle, fontSt]} activeBtnStyle={activeBtnStyle} activeTextStyle={activeTextStyle} key={index} isActive={isCurrentPage(pag, currentPage)} onPress={() => handleChangePage(pag)}>
                    {pag}
                    </PaginationButton>
                </ViewM>
                ) : (<ViewM key={index}><Text style={{color:'#000'}}>...</Text></ViewM>)
            })
        }
    </PaginationSideButtons>);
};
export default Pagination;
