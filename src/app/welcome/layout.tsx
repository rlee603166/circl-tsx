"use client";

import React, { Suspense } from 'react';
import WelcomeScreen from './page';

function WelcomePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WelcomeScreen />
        </Suspense>
    );
}

export default WelcomePage; 